/**
 * BaoPulse — Client-side Router (hash-based for GitHub Pages compatibility)
 */
import { getState, setState } from './state.js';
import { requireAuth } from './auth.js';

const routes = new Map();
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes.set(path, handler);
}

export function navigate(path) {
  window.location.hash = path.startsWith('#') ? path : '#' + path;
}

export function startRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

async function handleRoute() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const hash = window.location.hash.slice(1) || '/';
  const [pathname, queryString] = hash.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString || ''));

  setState({ currentRoute: pathname });

  // Auth routes
  const publicRoutes = ['/login', '/signup', '/recover'];
  const { user } = getState();

  if (!user && !publicRoutes.includes(pathname) && !pathname.startsWith('/u/') && pathname !== '/search') {
    // Allow viewing public profiles and search without auth, but feed requires auth
    if (pathname === '/' || pathname === '/notifications' || pathname === '/settings' || pathname === '/compose') {
      navigate('/login');
      return;
    }
  }

  if (user && publicRoutes.includes(pathname)) {
    navigate('/');
    return;
  }

  // Find matching route
  let matched = null;
  let routeParams = {};

  for (const [pattern, handler] of routes) {
    const result = matchRoute(pattern, pathname);
    if (result) {
      matched = handler;
      routeParams = result;
      break;
    }
  }

  if (!matched) {
    matched = routes.get('/404') || (() => {
      document.getElementById('app').innerHTML = '<div class="empty-state"><h2>Страница не найдена</h2></div>';
    });
  }

  const cleanup = await matched({ ...routeParams, ...params, pathname });
  if (typeof cleanup === 'function') {
    currentCleanup = cleanup;
  }
}

function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
