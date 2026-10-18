/**
 * BaoPulse — Search
 */
import { supabase } from './supabase.js';
import { CONFIG } from './config.js';

export async function searchUsers(query, limit = CONFIG.SEARCH_PAGE_SIZE) {
  if (!query || query.length < 2) return { data: [] };

  const q = query.replace(/^@/, '').toLowerCase();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, is_verified, bio, followers_count')
    .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
    .order('followers_count', { ascending: false })
    .limit(limit);

  if (error) return { error: error.message };
  return { data: data || [] };
}

export async function searchPosts(query, cursor = null, limit = CONFIG.SEARCH_PAGE_SIZE) {
  if (!query || query.length < 2) return { data: [] };

  let q = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, username, display_name, avatar_url, is_verified),
      media:post_media(*)
    `)
    .ilike('content', `%${query}%`)
    .is('deleted_at', null)
    .eq('is_reply', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) q = q.lt('created_at', cursor);

  const { data, error } = await q;
  if (error) return { error: error.message };
  return { data: data || [], nextCursor: data?.length === limit ? data[data.length - 1].created_at : null };
}

export async function searchHashtags(query, limit = 10) {
  if (!query) return { data: [] };
  const tag = query.replace(/^#/, '').toLowerCase();

  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .ilike('tag', `%${tag}%`)
    .order('posts_count', { ascending: false })
    .limit(limit);

  if (error) return { error: error.message };
  return { data: data || [] };
}

export async function getTrendingHashtags(limit = 8) {
  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .order('posts_count', { ascending: false })
    .limit(limit);

  if (error) return { data: [] };
  return { data: data || [] };
}
