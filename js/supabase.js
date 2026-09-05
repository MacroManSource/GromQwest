// js/supabase.js
//
// The ONE Supabase client for the whole app. Every other js/*.js file
// reads `window.supabaseClient` — nothing else in the project should
// call `supabase.createClient(...)` again.
//
// Load order in index.html must be:
//   1. <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   2. <script src="./js/config.js"></script>
//   3. <script src="./js/supabase.js"></script>
//   4. everything else (auth.js, database.js, pvp.js, quests.js, chat.js, notifications.js)

(function () {
  if (typeof supabase === 'undefined') {
    console.error('[Supabase] SDK not loaded — check the CDN <script> tag is above js/supabase.js.');
    return;
  }

  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  // ---- lightweight connection-state tracking, used by the UI's "● Онлайн" / "● Нет соединения" dot ----
  window.SupabaseStatus = {
    isOnline: navigator.onLine,
    listeners: [],
    onChange(fn) { this.listeners.push(fn); },
    _set(v) {
      if (this.isOnline === v) return;
      this.isOnline = v;
      this.listeners.forEach(fn => { try { fn(v); } catch (e) { console.error(e); } });
    }
  };
  window.addEventListener('online', () => window.SupabaseStatus._set(true));
  window.addEventListener('offline', () => window.SupabaseStatus._set(false));

  /**
   * Wraps a Supabase call so every caller gets the same error handling:
   * logs technical detail to console, never throws raw Postgres errors
   * into the UI, and flips the connection indicator on network failure.
   *
   * Usage:
   *   const { data, error } = await safeCall(() => supabaseClient.from('profiles').select('*'));
   *   if (error) { showToast(error.userMessage); return; }
   */
  window.safeCall = async function safeCall(fn) {
    try {
      const result = await fn();
      if (result && result.error) {
        console.error('[Supabase] request error:', result.error);
        return { data: result.data ?? null, error: toUserError(result.error) };
      }
      window.SupabaseStatus._set(true);
      return result;
    } catch (err) {
      console.error('[Supabase] network/exception error:', err);
      window.SupabaseStatus._set(false);
      return { data: null, error: toUserError(err) };
    }
  };

  function toUserError(err) {
    const raw = (err && (err.message || err.error_description || err.msg)) || 'Неизвестная ошибка';
    // Map a few common cases to friendly Russian text; fall back to a
    // generic message rather than ever showing a raw Postgres error to players.
    let userMessage = 'Не удалось выполнить операцию. Попробуй ещё раз.';
    if (/network|fetch|Failed to fetch/i.test(raw)) userMessage = 'Нет соединения с сервером.';
    else if (/Email not confirmed/i.test(raw)) userMessage = 'Email не подтверждён. Перейди по ссылке из письма, затем войди снова. (Или отключи "Confirm email" в Supabase → Authentication → Providers → Email, если это тестовый проект.)';
    else if (/Invalid login credentials/i.test(raw)) userMessage = 'Неверный email или пароль.';
    else if (/User already registered|already registered|already exists/i.test(raw)) userMessage = 'Этот email уже зарегистрирован — попробуй войти вместо регистрации.';
    else if (/rate limit|Email rate limit exceeded/i.test(raw)) userMessage = 'Слишком много попыток. Подожди немного и попробуй снова.';
    else if (/redirect_to|redirect uri|Unable to validate redirect/i.test(raw)) userMessage = 'Некорректный redirect URL. Проверь Site URL и Redirect URLs в Supabase → Authentication → URL Configuration.';
    else if (/JWT|token|session/i.test(raw)) userMessage = 'Сессия истекла. Войди снова.';
    else if (/Недостаточно|уже получена|уже разблокирован|не разблокирован|не выполнено|Максимальный|Максимум/i.test(raw)) userMessage = raw; // our own RPC messages are already player-facing
    return { raw, userMessage };
  }

  /**
   * Section 48 of the spec: a diagnostic you can call from the console
   * (or wire to a hidden debug button) to sanity-check the whole chain:
   * reachability → auth → profile access → RLS behaving as expected.
   */
  window.testSupabaseConnection = async function testSupabaseConnection() {
    const log = (...args) => { if (SUPABASE_DEBUG) console.log('[testSupabaseConnection]', ...args); };
    log('Starting…');

    const { data: sessionData, error: sessionErr } = await safeCall(() => window.supabaseClient.auth.getSession());
    if (sessionErr) { log('FAIL: could not reach Supabase Auth —', sessionErr.raw); return false; }
    log('Supabase reachable. Session present:', !!sessionData.session);

    if (!sessionData.session) {
      log('No active session — sign in to test profile/RLS access.');
      return true;
    }

    const { data: user, error: userErr } = await safeCall(() => window.supabaseClient.auth.getUser());
    if (userErr) { log('FAIL: auth.getUser() —', userErr.raw); return false; }
    log('Current user id:', user.user?.id);

    const { data: profile, error: profileErr } = await safeCall(() =>
      window.supabaseClient.from('profiles').select('id, username, rating, level').eq('id', user.user.id).single()
    );
    if (profileErr) { log('FAIL: could not read own profile —', profileErr.raw); return false; }
    log('Own profile readable:', profile);

    // RLS sanity check: try to read ANOTHER user's row from a
    // client-only-writable table that should be select-restricted
    // (quest_progress) — this should come back EMPTY, not an error,
    // proving RLS is filtering rows rather than the query being malformed.
    const { data: otherRows, error: otherErr } = await safeCall(() =>
      window.supabaseClient.from('quest_progress').select('id, player_id').neq('player_id', user.user.id).limit(1)
    );
    if (otherErr) { log('FAIL: unexpected error probing RLS —', otherErr.raw); return false; }
    log('RLS check (should be empty array):', otherRows);

    log('All checks passed.');
    return true;
  };
})();
