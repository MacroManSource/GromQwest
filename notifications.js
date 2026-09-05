// js/notifications.js
//
// Thin wrapper around window.GameData.notifications (already loaded and
// kept live by database.js's Realtime subscription). This file is just
// the read/mark-read API + a couple of formatting helpers for the UI.
// Clients can never INSERT a notification themselves (no grant) — they
// are created by resolve_pvp_battle_bot, claim_quest, admin tools, etc.

window.Notifications = {
  list() {
    return window.GameData.notifications || [];
  },

  unreadCount() {
    return window.GameData.unreadNotifications || 0;
  },

  async markRead(id) {
    return window.Database.markNotificationRead(id);
  },

  async markAllRead() {
    const unread = this.list().filter(n => !n.is_read);
    if (!unread.length) return { error: null };
    const { error } = await safeCall(() =>
      window.supabaseClient
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', window.AuthState.user.id)
        .eq('is_read', false)
    );
    if (!error) {
      unread.forEach(n => { n.is_read = true; });
      window.GameData.unreadNotifications = 0;
    }
    return { error };
  },

  icon(type) {
    return { pvp: '⚔', quest: '📋', hero: '🎭', system: '⚠', reward: '🎁', admin: '🛡' }[type] || '🔔';
  }
};
