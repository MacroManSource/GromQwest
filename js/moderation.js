/**
 * BaoPulse — Moderation (blocks, reports, hide)
 */
import { supabase } from './supabase.js';
import { getState } from './state.js';
import { showToast } from './utils.js';

export async function blockUser(targetId) {
  const { user } = getState();
  if (!user || user.id === targetId) return { error: 'Нельзя' };

  const { error } = await supabase.from('blocks').insert({
    blocker_id: user.id,
    blocked_id: targetId
  });

  if (error) return { error: error.message };

  // Also unfollow both ways
  await supabase.from('follows').delete().or(`and(follower_id.eq.${user.id},following_id.eq.${targetId}),and(follower_id.eq.${targetId},following_id.eq.${user.id})`);

  return { success: true };
}

export async function unblockUser(targetId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  await supabase.from('blocks').delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', targetId);

  return { success: true };
}

export async function muteUser(targetId) {
  const { user } = getState();
  if (!user || user.id === targetId) return { error: 'Нельзя' };

  const { error } = await supabase.from('muted_users').insert({
    user_id: user.id,
    muted_id: targetId
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function hidePost(postId) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  await supabase.from('hidden_posts').insert({
    user_id: user.id,
    post_id: postId
  });

  return { success: true };
}

export async function reportContent({ targetType, targetPostId, targetUserId, reason, details }) {
  const { user } = getState();
  if (!user) return { error: 'Требуется авторизация' };

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    target_type: targetType,
    target_post_id: targetPostId || null,
    target_user_id: targetUserId || null,
    reason,
    details
  });

  if (error) return { error: error.message };
  showToast('Жалоба отправлена', 'success');
  return { success: true };
}
