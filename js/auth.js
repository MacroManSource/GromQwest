/**
 * BaoPulse — Authentication
 */
import { supabase } from './supabase.js';
import { setState, getState } from './state.js';
import { showToast, validateEmail, validatePassword, validateUsername } from './utils.js';
import { CONFIG } from './config.js';

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    await loadProfile(session.user.id);
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await loadProfile(session.user.id);
    } else if (event === 'SIGNED_OUT') {
      setState({ user: null, profile: null });
    }
  });
}

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Profile load error:', error);
    return;
  }

  setState({ user: { id: userId }, profile: data });
}

export async function signUp({ email, password, username, displayName }) {
  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr };

  const passErr = validatePassword(password);
  if (passErr) return { error: passErr };

  const userErr = validateUsername(username);
  if (userErr) return { error: userErr };

  // Check username uniqueness client-side first
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .maybeSingle();

  if (existing) {
    return { error: 'Этот username уже занят' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.toLowerCase(),
        display_name: displayName || username
      },
      emailRedirectTo: window.location.origin + (CONFIG.BASE_PATH || '') + '/#/login'
    }
  });

  if (error) {
    return { error: error.message };
  }

  return { data, needsConfirmation: !data.session };
}

export async function signIn({ email, password }) {
  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function signOut() {
  await supabase.auth.signOut();
  setState({ user: null, profile: null });
  window.location.hash = '#/login';
}

export async function resetPassword(email) {
  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + (CONFIG.BASE_PATH || '') + '/#/recover'
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updatePassword(newPassword) {
  const passErr = validatePassword(newPassword);
  if (passErr) return { error: passErr };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}

export function requireAuth() {
  const { user } = getState();
  if (!user) {
    window.location.hash = '#/login';
    return false;
  }
  return true;
}
