/**
 * BaoPulse — Notifications + Realtime
 */
import { supabase } from './supabase.js';
import { getState, setState } from './state.js';
import { CONFIG } from './config.js';
import { formatRelativeTime } from './utils.js';

let realtimeChannel = null;

export async function getNotifications(cursor = null, limit = CONFIG.NOTIFICATIONS_PAGE_SIZE) {
  const { user } = getState();
  if (!user) return { data: [] };

  let query = supabase
    .from('notifications')
    .select(`
      *,
      actor:profiles!actor_id(id, username, display_name, avatar_url, is_verified),
      post:posts(id, content)
    `)
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt('created_at', cursor);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data: data || [], nextCursor: data?.length === limit ? data[data.length - 1].created_at : null };
}

export async function markAsRead(notificationId) {
  const { user } = getState();
  if (!user) return;

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('recipient_id', user.id);
}

export async function markAllAsRead() {
  const { user } = getState();
  if (!user) return;

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', user.id)
    .eq('is_read', false);

  setState({ unreadNotifications: 0 });
}

export async function getUnreadCount() {
  const { user } = getState();
  if (!user) return 0;

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .eq('is_read', false);

  setState({ unreadNotifications: count || 0 });
  return count || 0;
}

export function subscribeToNotifications() {
  const { user } = getState();
  if (!user) return;

  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabase
    .channel('notifications:' + user.id)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${user.id}`
      },
      (payload) => {
        setState({ unreadNotifications: (getState().unreadNotifications || 0) + 1 });
        // Optional: show toast
      }
    )
    .subscribe();
}

export function unsubscribeFromNotifications() {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

export function renderNotification(n) {
  const actor = n.actor || {};
  const texts = {
    follow: 'подписался на вас',
    like: 'лайкнул вашу публикацию',
    reply: 'ответил на вашу публикацию',
    repost: 'сделал репост',
    quote: 'процитировал вас',
    mention: 'упомянул вас'
  };

  return `
    <div class="notification-item ${n.is_read ? '' : 'unread'}" data-id="${n.id}">
      <a href="#/u/${actor.username}" class="notif-avatar">
        <img src="${actor.avatar_url || '/assets/default-avatar.svg'}" alt="">
      </a>
      <div class="notif-body">
        <p><strong>${actor.display_name || actor.username}</strong> ${texts[n.type] || n.type}</p>
        ${n.post ? `<p class="notif-preview">${(n.post.content || '').slice(0, 80)}</p>` : ''}
        <time>${formatRelativeTime(n.created_at)}</time>
      </div>
    </div>
  `;
}
