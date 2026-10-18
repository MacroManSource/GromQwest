/**
 * BaoPulse — Public Configuration
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values.
 * Never put service_role key here.
 */

export const CONFIG = {
  // === SUPABASE (заполните своими значениями) ===
  SUPABASE_URL: 'https://qsxxyrxpzkyuwnupkesf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_f0hFhhelV4thfnuvQAhB_A_WOGelAko',

  // === App ===
  APP_NAME: 'BaoPulse',
  APP_SLOGAN: 'Лови пульс мира',
  BASE_PATH: '', // например '/baopulse' если репозиторий в подпапке GitHub Pages

  // === Limits ===
  MAX_POST_LENGTH: 1000,
  MAX_BIO_LENGTH: 160,
  MAX_USERNAME_LENGTH: 30,
  MAX_IMAGES_PER_POST: 4,
  MAX_AVATAR_SIZE_MB: 2,
  MAX_POST_IMAGE_SIZE_MB: 5,

  // === Feed ranking weights (heuristic) ===
  FEED_WEIGHTS: {
    freshness: 0.35,
    engagement: 0.25,
    socialGraph: 0.20,
    diversity: 0.10,
    interest: 0.10
  },

  // === Pagination ===
  FEED_PAGE_SIZE: 20,
  SEARCH_PAGE_SIZE: 15,
  NOTIFICATIONS_PAGE_SIZE: 30,

  // === Theme ===
  THEME_KEY: 'baopulse_theme', // 'light' | 'dark' | 'system'
};
