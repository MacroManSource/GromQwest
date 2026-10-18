/**
 * BaoPulse — Smart Feed
 */
import { supabase } from './supabase.js';
import { getState } from './state.js';
import { CONFIG } from './config.js';
import { renderPostCard } from './posts.js';

/**
 * Following feed — chronological
 */
export async function getFollowingFeed(cursor = null, limit = CONFIG.FEED_PAGE_SIZE) {
  const { user } = getState();
  if (!user) return { data: [], nextCursor: null };

  // Get following IDs
  const { data: follows } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  const followingIds = follows?.map(f => f.following_id) || [];
  followingIds.push(user.id); // include own posts

  if (followingIds.length === 0) {
    return { data: [], nextCursor: null };
  }

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, username, display_name, avatar_url, is_verified),
      media:post_media(*)
    `)
    .in('author_id', followingIds)
    .is('deleted_at', null)
    .eq('is_reply', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return { data: [], nextCursor: null };
  }

  const nextCursor = data.length === limit ? data[data.length - 1].created_at : null;
  return { data, nextCursor };
}

/**
 * For You feed — heuristic ranking
 * Factors: freshness, engagement, social graph proximity, diversity
 */
export async function getForYouFeed(cursor = null, limit = CONFIG.FEED_PAGE_SIZE) {
  const { user } = getState();
  const weights = CONFIG.FEED_WEIGHTS;

  // Fetch recent public posts (last 7 days for performance)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, username, display_name, avatar_url, is_verified, followers_count),
      media:post_media(*)
    `)
    .is('deleted_at', null)
    .eq('is_reply', false)
    .eq('visibility', 'public')
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(100); // fetch more, then rank client-side for simplicity

  // Exclude hidden posts and blocked users if logged in
  if (user) {
    // We'll filter client-side for now (can be optimized with RPC later)
  }

  const { data: posts, error } = await query;
  if (error || !posts) {
    console.error(error);
    return { data: [], nextCursor: null };
  }

  // Get social graph info
  let followingSet = new Set();
  let mutedSet = new Set();
  let hiddenSet = new Set();

  if (user) {
    const [followsRes, mutedRes, hiddenRes] = await Promise.all([
      supabase.from('follows').select('following_id').eq('follower_id', user.id),
      supabase.from('muted_users').select('muted_id').eq('user_id', user.id),
      supabase.from('hidden_posts').select('post_id').eq('user_id', user.id)
    ]);
    followingSet = new Set(followsRes.data?.map(f => f.following_id) || []);
    mutedSet = new Set(mutedRes.data?.map(m => m.muted_id) || []);
    hiddenSet = new Set(hiddenRes.data?.map(h => h.post_id) || []);
  }

  // Score posts
  const now = Date.now();
  const scored = posts
    .filter(p => !hiddenSet.has(p.id) && !mutedSet.has(p.author_id))
    .map(post => {
      const ageHours = (now - new Date(post.created_at).getTime()) / 3600000;
      const freshness = Math.exp(-ageHours / 24); // decay over 24h

      const engagement = Math.log1p(
        (post.likes_count || 0) * 1 +
        (post.replies_count || 0) * 2 +
        (post.reposts_count || 0) * 1.5
      ) / 10;

      const social = followingSet.has(post.author_id) ? 1 : 0.3;

      // Simple diversity penalty will be applied later
      const score =
        weights.freshness * freshness +
        weights.engagement * engagement +
        weights.socialGraph * social +
        weights.diversity * 0.5 +
        weights.interest * 0.5;

      return { ...post, _score: score };
    })
    .sort((a, b) => b._score - a._score);

  // Diversity: limit same author
  const seenAuthors = new Map();
  const diversified = [];
  for (const post of scored) {
    const count = seenAuthors.get(post.author_id) || 0;
    if (count < 2) {
      diversified.push(post);
      seenAuthors.set(post.author_id, count + 1);
    }
    if (diversified.length >= limit) break;
  }

  // Cursor is last score for simplicity (in production use keyset)
  const nextCursor = diversified.length === limit ? diversified[diversified.length - 1].created_at : null;

  return { data: diversified, nextCursor };
}

export function renderFeed(container, posts, append = false) {
  if (!append) container.innerHTML = '';
  if (!posts.length && !append) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Пока тихо</h3>
        <p>Подпишитесь на интересных авторов или создайте первую публикацию</p>
      </div>
    `;
    return;
  }
  const html = posts.map(p => renderPostCard(p)).join('');
  if (append) {
    container.insertAdjacentHTML('beforeend', html);
  } else {
    container.innerHTML = html;
  }
}
