/**
 * BaoPulse — Utility helpers
 */
import { CONFIG } from './config.js';

export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return 'сейчас';
  if (diff < 3600) return `${Math.floor(diff / 60)}м`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}д`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function linkifyContent(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // Hashtags
  html = html.replace(/#([a-zA-Zа-яА-Я0-9_]+)/g, '<a href="#/search?q=%23$1" class="hashtag">#$1</a>');

  // Mentions
  html = html.replace(/@([a-zA-Z0-9_]+)/g, '<a href="#/u/$1" class="mention">@$1</a>');

  // URLs
  html = html.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="external-link">$1</a>'
  );

  return html;
}

export function extractHashtags(text) {
  const matches = text.match(/#([a-zA-Zа-яА-Я0-9_]+)/g) || [];
  return [...new Set(matches.map(t => t.slice(1).toLowerCase()))];
}

export function extractMentions(text) {
  const matches = text.match(/@([a-zA-Z0-9_]+)/g) || [];
  return [...new Set(matches.map(t => t.slice(1).toLowerCase()))];
}

export function getBasePath() {
  return CONFIG.BASE_PATH || '';
}

export function path(p) {
  const base = getBasePath();
  if (!p.startsWith('/')) p = '/' + p;
  return base + p;
}

export function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

export function createSkeleton(count = 3) {
  return Array.from({ length: count }, () => `
    <div class="skeleton-post">
      <div class="skeleton avatar"></div>
      <div class="skeleton-lines">
        <div class="skeleton line short"></div>
        <div class="skeleton line"></div>
        <div class="skeleton line medium"></div>
      </div>
    </div>
  `).join('');
}

export function validateUsername(username) {
  if (!username || username.length < 3 || username.length > 30) {
    return 'Username должен быть от 3 до 30 символов';
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return 'Только латиница, цифры и подчёркивание';
  }
  return null;
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Пароль должен быть не менее 8 символов';
  }
  return null;
}

export function validateEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Введите корректный email';
  }
  return null;
}

export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}
