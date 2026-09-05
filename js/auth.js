// js/auth.js
//
// Wraps Supabase Auth. This module owns exactly one piece of state:
// window.AuthState.user / .session — everything else in the app reads
// that instead of calling supabase.auth.* directly, so there is one
// obvious place to look when debugging "who does the app think is logged in".

// Only ever pass an explicit redirect URL when we're actually served over
// http(s) — over file:// (common while testing locally by double-clicking
// index.html) this would send Supabase a "file:///Users/..." URL that
// almost certainly isn't in the project's Redirect URLs allowlist, which
// can make signUp()/resetPasswordForEmail() fail outright. When we skip
// it, Supabase falls back to the Site URL configured in the dashboard,
// which is the safer default anyway.
function safeRedirectUrl() {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return null;
  return location.origin + location.pathname; // strip any ?query or #hash
}

window.AuthState = {
  user: null,
  session: null,
  profile: null,
  ready: false, // becomes true once the initial getSession() resolves
  listeners: []
};

window.Auth = {
  onChange(fn) { window.AuthState.listeners.push(fn); },
  _notify() {
    window.AuthState.listeners.forEach(fn => {
      try { fn(window.AuthState); } catch (e) { console.error(e); }
    });
  },

  /** Call once on page load, before rendering the boot/auth-gate screen. */
  async init() {
    const { data, error } = await safeCall(() => window.supabaseClient.auth.getSession());
    if (error) {
      console.error('[Auth] getSession failed:', error.raw);
    } else {
      window.AuthState.session = data.session;
      window.AuthState.user = data.session ? data.session.user : null;
    }
    window.AuthState.ready = true;

    // Keep session in sync across tab refreshes, token refresh, sign-out
    // in another tab, etc. — this is what makes "session persists after
    // reload" actually true rather than a one-time check.
    window.supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      window.AuthState.session = session;
      window.AuthState.user = session ? session.user : null;
      if (session) {
        await window.Database.loadEverythingAfterLogin();
      } else {
        window.AuthState.profile = null;
      }
      this._notify();
    });

    if (window.AuthState.user) {
      await window.Database.loadEverythingAfterLogin();
    }
    this._notify();
    return window.AuthState;
  },

  /**
   * @param {string} email
   * @param {string} password
   * @param {string} username  shown everywhere in-game; stored on the
   *   auth user's metadata so the handle_new_user() trigger can use it
   *   when creating the profiles row.
   */
  async signUp(email, password, username) {
    if (!email || !password || !username) {
      return { data: null, error: { userMessage: 'Заполни email, пароль и позывной.' } };
    }
    if (password.length < 6) {
      return { data: null, error: { userMessage: 'Пароль должен быть не короче 6 символов.' } };
    }
    const options = { data: { username } };
    const redirect = safeRedirectUrl();
    if (redirect) options.emailRedirectTo = redirect;
    const { data, error } = await safeCall(() => window.supabaseClient.auth.signUp({ email, password, options }));
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await safeCall(() => window.supabaseClient.auth.signInWithPassword({ email, password }));
    return { data, error };
  },

  async signOut() {
    const { error } = await safeCall(() => window.supabaseClient.auth.signOut());
    window.AuthState.user = null;
    window.AuthState.session = null;
    window.AuthState.profile = null;
    this._notify();
    return { error };
  },

  async sendPasswordReset(email) {
    const opts = {};
    const redirect = safeRedirectUrl();
    if (redirect) opts.redirectTo = redirect;
    const { data, error } = await safeCall(() => window.supabaseClient.auth.resetPasswordForEmail(email, opts));
    return { data, error };
  },

  isLoggedIn() {
    return !!window.AuthState.user;
  }
};
