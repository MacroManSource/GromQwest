// js/chat.js
//
// Realtime chat backed by chat_messages. The server-side rate limit and
// empty-message guard live in a trigger (enforce_chat_rate_limit, see
// schema.sql) — the client-side checks here are just for a snappy UI,
// they are not the actual security boundary.

window.Chat = {
  messages: [],
  channel: null,
  lastSentAt: 0,

  async loadRecent(limit = 50) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('chat_messages')
        .select('id, user_id, message, created_at, edited_at, is_deleted, profiles:user_id (username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(limit)
    );
    if (error) { console.error('[Chat] loadRecent failed:', error.raw); return { data: [], error }; }
    this.messages = (data || []).slice().reverse();
    return { data: this.messages, error: null };
  },

  subscribe(onInsert) {
    if (this.channel) return;
    this.channel = window.supabaseClient
      .channel('public:chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, async payload => {
        // Fetch the joined username/avatar for display rather than trusting
        // anything beyond the row itself.
        const { data } = await safeCall(() =>
          window.supabaseClient
            .from('chat_messages')
            .select('id, user_id, message, created_at, edited_at, is_deleted, profiles:user_id (username, avatar_url)')
            .eq('id', payload.new.id)
            .single()
        );
        const row = data || payload.new;
        this.messages.push(row);
        if (onInsert) onInsert(row);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages' }, payload => {
        const idx = this.messages.findIndex(m => m.id === payload.new.id);
        if (idx !== -1) this.messages[idx] = Object.assign({}, this.messages[idx], payload.new);
      })
      .subscribe(status => { if (SUPABASE_DEBUG) console.log('[Chat] realtime status:', status); });
  },

  unsubscribe() {
    if (this.channel) { window.supabaseClient.removeChannel(this.channel); this.channel = null; }
  },

  async send(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return { data: null, error: { userMessage: 'Сообщение не может быть пустым.' } };
    if (trimmed.length > 500) return { data: null, error: { userMessage: 'Слишком длинное сообщение (макс. 500 символов).' } };
    if (Date.now() - this.lastSentAt < 1500) {
      return { data: null, error: { userMessage: 'Не так быстро — подожди секунду.' } };
    }
    this.lastSentAt = Date.now();

    const { data, error } = await safeCall(() =>
      window.supabaseClient.from('chat_messages').insert({ user_id: window.AuthState.user.id, message: trimmed }).select().single()
    );
    return { data, error };
  },

  async edit(messageId, newText) {
    const trimmed = (newText || '').trim();
    if (!trimmed) return { data: null, error: { userMessage: 'Сообщение не может быть пустым.' } };
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('chat_messages')
        .update({ message: trimmed, edited_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('user_id', window.AuthState.user.id) // belt-and-braces; RLS already enforces this
        .select().single()
    );
    return { data, error };
  },

  async softDelete(messageId) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('chat_messages')
        .update({ is_deleted: true })
        .eq('id', messageId)
        .eq('user_id', window.AuthState.user.id)
        .select().single()
    );
    return { data, error };
  }
};
