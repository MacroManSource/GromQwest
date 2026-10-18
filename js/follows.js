/**
 * BaoPulse — Follows
 */
import { supabase } from './supabase.js';
import { getState } from './state.js';
import { showToast } from './utils.js';

export async function toggleFollow(targetUserId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };
  if (user.id === targetUserId) return { error: 'Нельзя подписаться на себя' };

  const { data: existing } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .maybeSingle();

  if (existing) {
    await supabase.from('follows').delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);
    return { following: false };
  } else {
    await supabase.from('follows').insert({
      follower_id: user.id,
      following_id: targetUserId
    });

    // Notification
    await supabase.from('notifications').insert({
      recipient_id: targetUserId,
      actor_id: user.id,
      type: 'follow'
    });

    return { following: true };
  }
}

export async function isFollowing(targetUserId) {
  const { user } = getState();
  if (!user) return false;

  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .maybeSingle();

  return !!data;
}

export async function getFollowers(userId, cursor = null, limit = 20) {
  let query = supabase
    .from('follows')
    .select(`
      created_at,
      follower:profiles!follower_id(id, username, display_name, avatar_url, is_verified, bio)
    `)
    .eq('following_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data: data?.map(d => d.follower) || [] };
}

export async function getFollowing(userId, cursor = null, limit = 20) {
  let query = supabase
    .from('follows')
    .select(`
      created_at,
      following:profiles!following_id(id, username, display_name, avatar_url, is_verified, bio)
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data: data?.map(d => d.following) || [] };
}
