/**
 * BaoPulse — Global Application State
 */
import { CONFIG } from './config.js';

const listeners = new Map();

const state = {
  user: null,           // auth user
  profile: null,        // current profile from profiles table
  theme: localStorage.getItem(CONFIG.THEME_KEY) || 'system',
  feedMode: 'for-you',  // 'for-you' | 'following'
  isLoading: false,
  unreadNotifications: 0,
  currentRoute: '/',
};

export function getState() {
  return { ...state };
}

export function setState(partial) {
  Object.assign(state, partial);
  notify(partial);
}

export function subscribe(key, callback) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(callback);
  return () => listeners.get(key).delete(callback);
}

function notify(partial) {
  for (const [key, value] of Object.entries(partial)) {
    if (listeners.has(key)) {
      listeners.get(key).forEach(cb => cb(value, state));
    }
  }
  if (listeners.has('*')) {
    listeners.get('*').forEach(cb => cb(partial, state));
  }
}

export function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem(CONFIG.THEME_KEY, theme);
  applyTheme();
  notify({ theme });
}

export function applyTheme() {
  const root = document.documentElement;
  let resolved = state.theme;
  if (resolved === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', resolved);
}

// Listen system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.theme === 'system') applyTheme();
});
