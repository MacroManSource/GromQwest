/**
 * BaoPulse — Application Entry Point
 */
import { CONFIG } from './config.js';
import { applyTheme, getState, setState, setTheme } from './state.js';
import { initAuth, signIn, signUp, signOut, resetPassword, requireAuth } from './auth.js';
import { registerRoute, startRouter, navigate } from './router.js';
import { getFollowingFeed, getForYouFeed, renderFeed } from './feed.js';
import { createPost, toggleLike, toggleRepost, toggleBookmark, renderPostCard, getPost, getReplies } from './posts.js';
import { getProfileByUsername, updateProfile, uploadAvatar, getUserPosts } from './profiles.js';
import { toggleFollow, isFollowing } from './follows.js';
import { searchUsers, searchPosts, getTrendingHashtags } from './search.js';
import { getNotifications, markAllAsRead, getUnreadCount, subscribeToNotifications, renderNotification } from './notifications.js';
import { showToast, createSkeleton, debounce, formatNumber } from './utils.js';

async function boot() {
  applyTheme();
  await initAuth();
  registerAllRoutes();
  startRouter();
  bindGlobalEvents();
  const { user } = getState();
  if (user) {
    await getUnreadCount();
    subscribeToNotifications();
  }
}

function registerAllRoutes() {
  registerRoute('/', renderHome);
  registerRoute('/login', renderLogin);
  registerRoute('/signup', renderSignup);
  registerRoute('/recover', renderRecover);
  registerRoute('/u/:username', renderProfile);
  registerRoute('/post/:id', renderSinglePost);
  registerRoute('/search', renderSearch);
  registerRoute('/notifications', renderNotifications);
  registerRoute('/settings', renderSettings);
  registerRoute('/compose', () => { navigate('/'); setTimeout(() => document.getElementById('compose-text')?.focus(), 150); });
  registerRoute('/404', () => {
    document.getElementById('app').innerHTML = '<div class="empty-state"><h2>404</h2><p>Страница не найдена</p></div>';
  });
}

function bindGlobalEvents() {
  document.addEventListener('click', async (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const postCard = actionBtn.closest('.post-card');
    const postId = postCard?.dataset.postId;
    const action = actionBtn.dataset.action;
    if (!postId) return;

    if (action === 'like') {
      const res = await toggleLike(postId);
      if (res.liked !== undefined) {
        actionBtn.classList.toggle('liked', res.liked);
        const span = actionBtn.querySelector('span');
        if (span) {
          const n = parseInt(span.textContent.replace(/\D/g, '') || '0', 10);
          span.textContent = formatNumber(res.liked ? n + 1 : Math.max(0, n - 1));
        }
      }
    } else if (action === 'repost') {
      const res = await toggleRepost(postId);
      if (res.reposted !== undefined) actionBtn.classList.toggle('reposted', res.reposted);
    } else if (action === 'bookmark') {
      await toggleBookmark(postId);
      showToast('Сохранено', 'success');
    } else if (action === 'reply') {
      navigate('/post/' + postId);
    } else if (action === 'share') {
      const url = location.origin + location.pathname + '#/post/' + postId;
      await navigator.clipboard.writeText(url);
      showToast('Ссылка скопирована', 'success');
    }
  });
}

function defaultAvatar(size = 40) {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"%3E%3Ccircle fill="%2394a3b8" cx="${size/2}" cy="${size/2}" r="${size/2}"/%3E%3C/svg%3E`;
}

function renderAppShell(content, { showRight = true } = {}) {
  const { user, profile, unreadNotifications } = getState();
  const leftNav = user ? `
    <aside class="sidebar">
      <a href="#/" class="logo"><div class="logo-mark">B</div><span>BaoPulse</span></a>
      <ul class="nav-list">
        <li class="nav-item"><a href="#/" class="${!location.hash || location.hash === '#/' ? 'active' : ''}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg><span>Главная</span></a></li>
        <li class="nav-item"><a href="#/search"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg><span>Поиск</span></a></li>
        <li class="nav-item"><a href="#/notifications"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg><span>Активность${unreadNotifications ? ' (' + unreadNotifications + ')' : ''}</span></a></li>
        <li class="nav-item"><a href="#/u/${profile?.username || ''}"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span>Профиль</span></a></li>
        <li class="nav-item"><a href="#/settings"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg><span>Настройки</span></a></li>
      </ul>
      <button class="btn-compose" onclick="location.hash='#/compose'"><span>Публикация</span><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
      <div class="user-card" onclick="location.hash='#/u/${profile?.username}'">
        <img src="${profile?.avatar_url || defaultAvatar()}" alt="">
        <div class="info"><div class="name">${profile?.display_name || ''}</div><div class="handle">@${profile?.username || ''}</div></div>
      </div>
    </aside>` : '';

  const right = (showRight && user) ? `
    <aside class="right-panel">
      <div class="panel-card">
        <div class="search-input-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="search" placeholder="Поиск" onkeydown="if(event.key==='Enter')location.hash='#/search?q='+encodeURIComponent(this.value)">
        </div>
      </div>
      <div class="panel-card"><h3>Актуальные темы</h3><div id="trending-list">Загрузка…</div></div>
    </aside>` : '';

  const mobileNav = user ? `
    <nav class="mobile-nav">
      <a href="#/" class="${!location.hash || location.hash === '#/' ? 'active' : ''}"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>Главная</a>
      <a href="#/search"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>Поиск</a>
      <button class="compose-fab" onclick="location.hash='#/compose'"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
      <a href="#/notifications"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>Активность</a>
      <a href="#/u/${profile?.username || ''}"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>Профиль</a>
    </nav>` : '';

  document.getElementById('app').innerHTML = `<div class="app-shell">${leftNav}<main class="main">${content}</main>${right}</div>${mobileNav}`;

  if (showRight && user) {
    getTrendingHashtags().then(({ data }) => {
      const el = document.getElementById('trending-list');
      if (el) el.innerHTML = (data || []).length
        ? data.map(t => `<a href="#/search?q=%23${t.tag}" style="display:block;padding:0.5rem 0"><strong>#${t.tag}</strong> <span style="color:var(--text-secondary);font-size:0.85em">${formatNumber(t.posts_count)}</span></a>`).join('')
        : '<p style="color:var(--text-secondary)">Пока нет тем</p>';
    });
  }
}

async function renderHome() {
  const { user, feedMode } = getState();
  if (!user) { navigate('/login'); return; }

  renderAppShell(`
    <div class="main-header"><div class="feed-tabs">
      <button class="feed-tab ${feedMode === 'for-you' ? 'active' : ''}" data-mode="for-you">Для вас</button>
      <button class="feed-tab ${feedMode === 'following' ? 'active' : ''}" data-mode="following">Подписки</button>
    </div></div>
    <div class="compose-box">
      <img src="${getState().profile?.avatar_url || defaultAvatar(44)}" width="44" height="44" style="border-radius:50%;object-fit:cover">
      <div style="flex:1">
        <textarea id="compose-text" placeholder="Что происходит?" maxlength="${CONFIG.MAX_POST_LENGTH}"></textarea>
        <div class="compose-actions">
          <label class="btn-icon" title="Изображение"><input type="file" accept="image/*" multiple hidden id="compose-files">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          </label>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <span class="char-count" id="char-count">0 / ${CONFIG.MAX_POST_LENGTH}</span>
            <button class="btn btn-primary" id="compose-submit">Опубликовать</button>
          </div>
        </div>
        <div id="compose-preview" style="display:flex;gap:0.5rem;margin-top:0.5rem;flex-wrap:wrap"></div>
      </div>
    </div>
    <div id="feed-container">${createSkeleton(4)}</div>
  `);

  document.querySelectorAll('.feed-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setState({ feedMode: tab.dataset.mode });
      loadFeed();
      document.querySelectorAll('.feed-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === tab.dataset.mode));
    });
  });

  const textarea = document.getElementById('compose-text');
  const charCount = document.getElementById('char-count');
  let selectedFiles = [];

  textarea?.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = len + ' / ' + CONFIG.MAX_POST_LENGTH;
    charCount.classList.toggle('near-limit', len > CONFIG.MAX_POST_LENGTH * 0.9);
    charCount.classList.toggle('over-limit', len > CONFIG.MAX_POST_LENGTH);
  });

  document.getElementById('compose-files')?.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files).slice(0, CONFIG.MAX_IMAGES_PER_POST);
    document.getElementById('compose-preview').innerHTML = selectedFiles.map((f, i) =>
      `<div style="position:relative"><img src="${URL.createObjectURL(f)}" style="width:80px;height:80px;object-fit:cover;border-radius:8px"><button style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border-radius:50%;width:20px;height:20px;font-size:12px" data-rm="${i}">×</button></div>`
    ).join('');
  });

  document.getElementById('compose-submit')?.addEventListener('click', async () => {
    const content = textarea.value.trim();
    const btn = document.getElementById('compose-submit');
    btn.disabled = true; btn.textContent = 'Публикация…';
    const res = await createPost({ content, mediaFiles: selectedFiles });
    btn.disabled = false; btn.textContent = 'Опубликовать';
    if (res.error) { showToast(res.error, 'error'); return; }
    showToast('Опубликовано', 'success');
    textarea.value = ''; selectedFiles = [];
    document.getElementById('compose-preview').innerHTML = '';
    charCount.textContent = '0 / ' + CONFIG.MAX_POST_LENGTH;
    loadFeed();
  });

  async function loadFeed() {
    const container = document.getElementById('feed-container');
    container.innerHTML = createSkeleton(3);
    const mode = getState().feedMode;
    const result = mode === 'following' ? await getFollowingFeed() : await getForYouFeed();
    renderFeed(container, result.data);
  }
  loadFeed();
}

async function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="auth-page"><div class="auth-card">
      <div class="logo" style="justify-content:center;margin-bottom:1rem"><div class="logo-mark">B</div><span>BaoPulse</span></div>
      <h1>Вход</h1><p class="slogan">Лови пульс мира</p>
      <form id="login-form">
        <div class="form-group"><label>Email</label><input type="email" class="form-input" name="email" required autocomplete="email"></div>
        <div class="form-group"><label>Пароль</label><input type="password" class="form-input" name="password" required autocomplete="current-password"></div>
        <div id="login-error" class="form-error" style="display:none"></div>
        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:0.5rem">Войти</button>
      </form>
      <div class="auth-footer"><p><a href="#/recover">Забыли пароль?</a></p><p style="margin-top:0.75rem">Нет аккаунта? <a href="#/signup">Зарегистрироваться</a></p></div>
    </div></div>`;
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target; const btn = form.querySelector('button'); btn.disabled = true;
    const res = await signIn({ email: form.email.value, password: form.password.value });
    if (res.error) { document.getElementById('login-error').style.display = 'block'; document.getElementById('login-error').textContent = res.error; btn.disabled = false; return; }
    navigate('/');
  });
}

async function renderSignup() {
  document.getElementById('app').innerHTML = `
    <div class="auth-page"><div class="auth-card">
      <div class="logo" style="justify-content:center;margin-bottom:1rem"><div class="logo-mark">B</div><span>BaoPulse</span></div>
      <h1>Регистрация</h1><p class="slogan">Создайте аккаунт</p>
      <form id="signup-form">
        <div class="form-group"><label>Email</label><input type="email" class="form-input" name="email" required></div>
        <div class="form-group"><label>Username</label><input type="text" class="form-input" name="username" required pattern="[a-z0-9_]{3,30}" placeholder="латиница, цифры, _"></div>
        <div class="form-group"><label>Отображаемое имя</label><input type="text" class="form-input" name="displayName" required maxlength="50"></div>
        <div class="form-group"><label>Пароль</label><input type="password" class="form-input" name="password" required minlength="8"></div>
        <div class="form-group"><label>Подтверждение</label><input type="password" class="form-input" name="password2" required></div>
        <div id="signup-error" class="form-error" style="display:none"></div>
        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:0.5rem">Создать аккаунт</button>
      </form>
      <div class="auth-footer">Уже есть аккаунт? <a href="#/login">Войти</a></div>
    </div></div>`;
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target; const btn = form.querySelector('button'); btn.disabled = true;
    if (form.password.value !== form.password2.value) {
      document.getElementById('signup-error').style.display = 'block';
      document.getElementById('signup-error').textContent = 'Пароли не совпадают';
      btn.disabled = false; return;
    }
    const res = await signUp({ email: form.email.value, password: form.password.value, username: form.username.value, displayName: form.displayName.value });
    if (res.error) { document.getElementById('signup-error').style.display = 'block'; document.getElementById('signup-error').textContent = res.error; btn.disabled = false; return; }
    if (res.needsConfirmation) { showToast('Проверьте почту для подтверждения', 'success'); navigate('/login'); }
    else navigate('/');
  });
}

async function renderRecover() {
  document.getElementById('app').innerHTML = `
    <div class="auth-page"><div class="auth-card">
      <h1>Восстановление пароля</h1><p class="slogan">Введите email</p>
      <form id="recover-form">
        <div class="form-group"><label>Email</label><input type="email" class="form-input" name="email" required></div>
        <div id="recover-msg" style="display:none;margin-bottom:1rem"></div>
        <button type="submit" class="btn btn-primary" style="width:100%">Отправить</button>
      </form>
      <div class="auth-footer"><a href="#/login">Назад</a></div>
    </div></div>`;
  document.getElementById('recover-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await resetPassword(e.target.email.value);
    const msg = document.getElementById('recover-msg'); msg.style.display = 'block';
    if (res.error) { msg.style.color = 'var(--danger)'; msg.textContent = res.error; }
    else { msg.style.color = 'var(--success)'; msg.textContent = 'Ссылка отправлена'; }
  });
}

async function renderProfile({ username }) {
  const { data: profile, error } = await getProfileByUsername(username);
  if (error || !profile) {
    document.getElementById('app').innerHTML = '<div class="empty-state"><h2>Пользователь не найден</h2></div>';
    return;
  }
  const { user } = getState();
  const isOwn = user && user.id === profile.id;
  let following = false;
  if (user && !isOwn) following = await isFollowing(profile.id);

  renderAppShell(`
    <div class="main-header"><button class="btn-icon" onclick="history.back()">←</button><strong>${profile.display_name}</strong><div></div></div>
    <div class="profile-header">
      <div class="profile-banner"></div>
      <img class="profile-avatar-lg" src="${profile.avatar_url || defaultAvatar(88)}" alt="">
      <div class="profile-info">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div><h2 style="font-size:1.35rem">${profile.display_name}</h2><p style="color:var(--text-secondary)">@${profile.username}</p></div>
          ${isOwn ? '<button class="btn btn-secondary" onclick="location.hash=\'#/settings\'">Редактировать</button>'
            : `<button class="btn ${following ? 'btn-secondary' : 'btn-primary'}" id="follow-btn">${following ? 'Отписаться' : 'Подписаться'}</button>`}
        </div>
        ${profile.bio ? `<p style="margin-top:0.75rem">${profile.bio}</p>` : ''}
        <div class="profile-stats">
          <div><strong>${formatNumber(profile.posts_count)}</strong> <span>публикаций</span></div>
          <div><strong>${formatNumber(profile.followers_count)}</strong> <span>подписчиков</span></div>
          <div><strong>${formatNumber(profile.following_count)}</strong> <span>подписок</span></div>
        </div>
      </div>
    </div>
    <div class="profile-tabs">
      <button class="profile-tab active" data-tab="posts">Публикации</button>
      <button class="profile-tab" data-tab="replies">Ответы</button>
    </div>
    <div id="profile-feed">${createSkeleton(3)}</div>
  `, { showRight: false });

  if (!isOwn && user) {
    document.getElementById('follow-btn')?.addEventListener('click', async () => {
      const res = await toggleFollow(profile.id);
      const btn = document.getElementById('follow-btn');
      if (res.following) { btn.textContent = 'Отписаться'; btn.className = 'btn btn-secondary'; }
      else { btn.textContent = 'Подписаться'; btn.className = 'btn btn-primary'; }
    });
  }

  async function loadProfilePosts(type = 'posts') {
    const { data } = await getUserPosts(profile.id, type);
    renderFeed(document.getElementById('profile-feed'), data || []);
  }
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadProfilePosts(tab.dataset.tab);
    });
  });
  loadProfilePosts();
}

async function renderSinglePost({ id }) {
  const { data: post, error } = await getPost(id);
  if (error || !post) {
    document.getElementById('app').innerHTML = '<div class="empty-state"><h2>Публикация не найдена</h2></div>';
    return;
  }
  const { data: replies } = await getReplies(id);
  renderAppShell(`
    <div class="main-header"><button class="btn-icon" onclick="history.back()">←</button><strong>Публикация</strong><div></div></div>
    <div id="single-post">${renderPostCard(post)}</div>
    <div class="compose-box" style="border-top:1px solid var(--border)">
      <div style="flex:1">
        <textarea id="reply-text" placeholder="Написать ответ…" maxlength="${CONFIG.MAX_POST_LENGTH}"></textarea>
        <div class="compose-actions"><div></div><button class="btn btn-primary" id="reply-submit">Ответить</button></div>
      </div>
    </div>
    <div id="replies-list">${(replies || []).map(r => renderPostCard(r)).join('') || '<div class="empty-state"><p>Пока нет ответов</p></div>'}</div>
  `, { showRight: false });

  document.getElementById('reply-submit')?.addEventListener('click', async () => {
    const content = document.getElementById('reply-text').value.trim();
    if (!content) return;
    const res = await createPost({ content, replyToId: id });
    if (res.error) { showToast(res.error, 'error'); return; }
    showToast('Ответ опубликован', 'success');
    renderSinglePost({ id });
  });
}

async function renderSearch({ q }) {
  const query = q || '';
  renderAppShell(`
    <div class="main-header">
      <div class="search-input-wrap" style="flex:1;margin:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="search" id="search-input" placeholder="Поиск" value="${(query || '').replace(/"/g, '&quot;')}">
      </div>
    </div>
    <div id="search-results" style="padding:1rem">${query ? createSkeleton(3) : '<div class="empty-state"><p>Введите запрос</p></div>'}</div>
  `, { showRight: false });

  const doSearch = debounce(async (val) => {
    if (!val || val.length < 2) {
      document.getElementById('search-results').innerHTML = '<div class="empty-state"><p>Минимум 2 символа</p></div>';
      return;
    }
    const [users, posts] = await Promise.all([searchUsers(val), searchPosts(val)]);
    let html = '';
    if (users.data?.length) {
      html += '<h3 style="padding:0.5rem 1rem;font-size:1rem">Пользователи</h3>';
      html += users.data.map(u => `<a href="#/u/${u.username}" style="display:flex;gap:0.75rem;padding:0.75rem 1rem;align-items:center;border-bottom:1px solid var(--border)">
        <img src="${u.avatar_url || defaultAvatar()}" width="40" height="40" style="border-radius:50%">
        <div><div style="font-weight:600">${u.display_name}</div><div style="color:var(--text-secondary);font-size:0.875rem">@${u.username}</div></div></a>`).join('');
    }
    if (posts.data?.length) {
      html += '<h3 style="padding:0.5rem 1rem;font-size:1rem;margin-top:1rem">Публикации</h3>';
      html += posts.data.map(p => renderPostCard(p)).join('');
    }
    document.getElementById('search-results').innerHTML = html || '<div class="empty-state"><p>Ничего не найдено</p></div>';
  }, 350);

  document.getElementById('search-input')?.addEventListener('input', (e) => doSearch(e.target.value.trim()));
  if (query) doSearch(query);
}

async function renderNotifications() {
  if (!requireAuth()) return;
  renderAppShell(`
    <div class="main-header"><strong>Активность</strong>
      <button class="btn btn-secondary" id="mark-all-read" style="font-size:0.8rem">Прочитать все</button></div>
    <div id="notif-list">${createSkeleton(4)}</div>
  `, { showRight: false });

  const { data } = await getNotifications();
  const list = document.getElementById('notif-list');
  list.innerHTML = data?.length ? data.map(renderNotification).join('') : '<div class="empty-state"><p>Нет уведомлений</p></div>';
  document.getElementById('mark-all-read')?.addEventListener('click', async () => {
    await markAllAsRead();
    showToast('Все прочитано', 'success');
    list.querySelectorAll('.notification-item').forEach(el => el.classList.remove('unread'));
  });
}

async function renderSettings() {
  if (!requireAuth()) return;
  const { profile } = getState();
  renderAppShell(`
    <div class="main-header"><button class="btn-icon" onclick="history.back()">←</button><strong>Настройки</strong><div></div></div>
    <div style="padding:1.5rem;max-width:480px">
      <h3 style="margin-bottom:1rem">Профиль</h3>
      <form id="settings-form">
        <div class="form-group"><label>Отображаемое имя</label><input type="text" class="form-input" name="display_name" value="${profile?.display_name || ''}" maxlength="50"></div>
        <div class="form-group"><label>Username</label><input type="text" class="form-input" name="username" value="${profile?.username || ''}" pattern="[a-z0-9_]{3,30}"></div>
        <div class="form-group"><label>О себе</label><textarea class="form-input" name="bio" rows="3" maxlength="160">${profile?.bio || ''}</textarea></div>
        <div class="form-group"><label>Аватар</label><input type="file" accept="image/*" id="avatar-input"></div>
        <button type="submit" class="btn btn-primary">Сохранить</button>
      </form>
      <h3 style="margin:2rem 0 1rem">Тема</h3>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-secondary" data-theme="light">Светлая</button>
        <button class="btn btn-secondary" data-theme="dark">Тёмная</button>
        <button class="btn btn-secondary" data-theme="system">Системная</button>
      </div>
      <h3 style="margin:2rem 0 1rem">Аккаунт</h3>
      <button class="btn btn-danger" id="logout-btn">Выйти</button>
    </div>
  `, { showRight: false });

  document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await updateProfile({ display_name: form.display_name.value, username: form.username.value, bio: form.bio.value });
    if (res.error) showToast(res.error, 'error'); else showToast('Сохранено', 'success');
  });
  document.getElementById('avatar-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const res = await uploadAvatar(file);
    if (res.error) showToast(res.error, 'error'); else showToast('Аватар обновлён', 'success');
  });
  document.querySelectorAll('[data-theme]').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
  document.getElementById('logout-btn')?.addEventListener('click', () => signOut());
}

boot().catch(console.error);
