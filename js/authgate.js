// js/authgate.js
//
// Controls the #screen-authgate screen (markup lives in index.html).
// On success it hides that screen and calls window.startLastAsylumGame()
// — the alias game.js leaves behind in place of its old unconditional
// `Game.init()` call — so the rest of the app boots exactly as before,
// just gated behind a real Supabase account.

(function () {
  let mode = 'signin';

  function el(id) { return document.getElementById(id); }

  function setMode(next) {
    mode = next;
    el('ag-username-field').style.display = mode === 'signup' ? 'block' : 'none';
    el('ag-submit-btn').textContent = mode === 'signup' ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ';
    el('ag-toggle-mode-btn').textContent = mode === 'signup' ? 'УЖЕ ЕСТЬ АККАУНТ? ВОЙТИ' : 'НЕТ АККАУНТА? ЗАРЕГИСТРИРОВАТЬСЯ';
    el('ag-error').textContent = '';
  }

  function showError(msg) { el('ag-error').textContent = msg || ''; }

  async function handleSubmit() {
    const email = el('ag-email').value.trim();
    const password = el('ag-password').value;
    const username = el('ag-username').value.trim();
    const btn = el('ag-submit-btn');

    if (!email || !password) { showError('Заполни email и пароль.'); return; }

    btn.disabled = true;
    showError('');
    el('ag-status').textContent = '';

    try {
      if (mode === 'signup') {
        if (!username) { showError('Введи позывной.'); return; }
        const { data, error } = await Auth.signUp(email, password, username);
        if (error) { showError(error.userMessage || error.raw || 'Не удалось зарегистрироваться.'); return; }
        if (data && data.session) {
          proceedToGame();
        } else {
          el('ag-status').textContent = 'Проверь почту и подтверди адрес, затем войди.';
          setMode('signin');
        }
      } else {
        const { data, error } = await Auth.signIn(email, password);
        if (error) { showError(error.userMessage || error.raw || 'Не удалось войти.'); return; }
        proceedToGame();
      }
    } finally {
      btn.disabled = false;
    }
  }

  function proceedToGame() {
    const screen = el('screen-authgate');
    if (screen) screen.classList.remove('active');
    if (window.startLastAsylumGame) window.startLastAsylumGame();

    // Game.init() only calls Nav.go('hub') itself for players who already
    // have local progress (state.registered === true, the OLD local-only
    // flag from before Supabase existed). For everyone else it just starts
    // the boot animation without ever marking #screen-boot active — that
    // used to be fine because #screen-boot had class="screen active" by
    // default in the HTML. Now that #screen-authgate takes that spot, we
    // have to explicitly show the boot screen ourselves in that case, or
    // no screen ends up visible at all (the black-screen bug).
    //
    // NOTE: `Nav` and `state` are declared with `const`/`let` inside
    // game.js, so — unlike `var` or function declarations — they do NOT
    // become `window.Nav` / `window.state`. They're still reachable as
    // bare identifiers here because classic (non-module) <script> tags
    // share one global lexical scope, but `typeof` is used below instead
    // of a direct reference so this can't throw a ReferenceError if
    // game.js somehow failed to load.
    const navAvailable = typeof Nav !== 'undefined';
    const alreadyRegisteredLocally = typeof state !== 'undefined' && state && state.registered;
    if (navAvailable && !alreadyRegisteredLocally) {
      Nav.go('boot');
    }
  }

  function wireConnectionDot() {
    const dot = el('conn-status-dot');
    const text = el('conn-status-text');
    if (!dot || !text || !window.SupabaseStatus) return;
    const render = online => {
      dot.style.color = online ? 'var(--accent)' : 'var(--danger)';
      text.textContent = online ? 'ОНЛАЙН' : 'НЕТ СОЕДИНЕНИЯ';
    };
    render(window.SupabaseStatus.isOnline);
    window.SupabaseStatus.onChange(render);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    wireConnectionDot();

    el('ag-submit-btn').onclick = handleSubmit;
    el('ag-password').addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
    el('ag-toggle-mode-btn').onclick = () => setMode(mode === 'signin' ? 'signup' : 'signin');
    el('ag-forgot-btn').onclick = async () => {
      const email = el('ag-email').value.trim();
      if (!email) { showError('Сначала введи email.'); return; }
      const { error } = await Auth.sendPasswordReset(email);
      el('ag-status').textContent = error ? (error.userMessage || 'Не удалось отправить письмо.') : 'Письмо для сброса пароля отправлено.';
    };

    if (!window.supabaseClient) {
      showError('Supabase не настроен — заполни js/config.js.');
      return;
    }

    await Auth.init();
    if (Auth.isLoggedIn()) {
      proceedToGame();
    }
    // otherwise: stay on #screen-authgate, which is already the active screen.
  });
})();
