// js/database.js
//
// Loads and caches everything under window.GameData after login (spec
// §38: load session → user → profile → heroes → progress → rating →
// quests → notifications → connect Realtime, in that order, once —
// not on every screen open).
//
// Every mutating action (level up, star up, gear, talents, unlock) goes
// through a Supabase RPC (SECURITY DEFINER function) rather than a raw
// table UPDATE, because those columns have no client UPDATE grant at
// all — see supabase/schema.sql. This module just calls .rpc(...) and
// refreshes the relevant slice of the cache from the RPC's return value.

window.GameData = {
  profile: null,
  heroes: [],        // heroes reference rows, joined with the player's player_heroes/gear/talents
  resources: null,   // player_resources row
  pvpRating: null,
  quests: [],        // today's quest_progress rows joined with quest definitions
  notifications: [],
  unreadNotifications: 0,
  loaded: false
};

window.Database = {
  async loadEverythingAfterLogin() {
    const uid = window.AuthState.user?.id;
    if (!uid) return;

    await this.loadProfile(uid);
    await this.loadHeroes(uid);
    await this.loadResources(uid);
    await this.loadPvpRating(uid);
    await this.loadTodayQuests();
    await this.loadNotifications(uid);
    this.connectRealtime(uid);
    this.startOnlineHeartbeat(uid);

    window.GameData.loaded = true;
    document.dispatchEvent(new CustomEvent('gamedata:ready'));
  },

  async loadProfile(uid) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('profiles')
        .select('id, username, avatar_url, alliance_tag, server_number, role, level, xp, rating, wins, losses, is_admin, created_at')
        .eq('id', uid)
        .single()
    );
    if (error) { console.error('[Database] loadProfile failed:', error.raw); return; }
    window.GameData.profile = data;
    window.AuthState.profile = data;
  },

  async updateProfileFields(fields) {
    // Only username/avatar_url/alliance_tag/server_number are grantable —
    // anything else will be silently rejected by Postgres column privileges.
    const { data, error } = await safeCall(() =>
      window.supabaseClient.from('profiles').update(fields).eq('id', window.AuthState.user.id).select().single()
    );
    if (!error) window.GameData.profile = data;
    return { data, error };
  },

  async loadHeroes(uid) {
    const { data: heroDefs, error: e1 } = await safeCall(() =>
      window.supabaseClient.from('heroes').select('*').order('is_starter', { ascending: false })
    );
    if (e1) { console.error('[Database] loadHeroes (defs) failed:', e1.raw); return; }

    const { data: playerHeroes, error: e2 } = await safeCall(() =>
      window.supabaseClient.from('player_heroes').select('*').eq('player_id', uid)
    );
    if (e2) { console.error('[Database] loadHeroes (player_heroes) failed:', e2.raw); return; }

    const { data: gear, error: e3 } = await safeCall(() =>
      window.supabaseClient.from('player_hero_gear').select('*').eq('player_id', uid)
    );
    const { data: talents, error: e4 } = await safeCall(() =>
      window.supabaseClient.from('hero_talents').select('*')
    );
    const { data: playerTalents, error: e5 } = await safeCall(() =>
      window.supabaseClient.from('player_hero_talents').select('*').eq('player_id', uid)
    );
    if (e3 || e4 || e5) { console.error('[Database] loadHeroes (gear/talents) failed'); }

    window.GameData.heroes = (heroDefs || []).map(def => {
      const ph = (playerHeroes || []).find(p => p.hero_id === def.id) || null;
      const heroGear = (gear || []).filter(g => g.hero_id === def.id);
      const heroTalentDefs = (talents || []).filter(t => t.hero_id === def.id);
      const heroTalentProgress = (playerTalents || []).filter(t => t.hero_id === def.id);
      return {
        def,
        playerHero: ph,
        gear: heroGear,
        talentDefs: heroTalentDefs,
        talentProgress: heroTalentProgress
      };
    });
  },

  async loadResources(uid) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient.from('player_resources').select('*').eq('player_id', uid).single()
    );
    if (error) { console.error('[Database] loadResources failed:', error.raw); return; }
    window.GameData.resources = data;
  },

  async loadPvpRating(uid) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient.from('pvp_rating').select('*').eq('player_id', uid).eq('season', 1).single()
    );
    if (error) { console.error('[Database] loadPvpRating failed:', error.raw); return; }
    window.GameData.pvpRating = data;
  },

  async loadTodayQuests() {
    const today = mskDateKeyISO();
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('quest_progress')
        .select('*, quests:quest_id (code, title, description, target, reward_xp, reward_currency, reward_item)')
        .eq('period_key', today)
    );
    if (error) { console.error('[Database] loadTodayQuests failed:', error.raw); return; }
    window.GameData.quests = data || [];
  },

  async loadNotifications(uid) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(30)
    );
    if (error) { console.error('[Database] loadNotifications failed:', error.raw); return; }
    window.GameData.notifications = data || [];
    window.GameData.unreadNotifications = (data || []).filter(n => !n.is_read).length;
  },

  async markNotificationRead(id) {
    const { error } = await safeCall(() =>
      window.supabaseClient.from('notifications').update({ is_read: true }).eq('id', id)
    );
    if (!error) {
      const n = window.GameData.notifications.find(x => x.id === id);
      if (n && !n.is_read) { n.is_read = true; window.GameData.unreadNotifications--; }
    }
    return { error };
  },

  // ---- hero upgrade RPCs -------------------------------------------------

  async unlockHero(heroId) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('unlock_hero', { p_hero_id: heroId }));
    if (!error) await this.loadHeroes(window.AuthState.user.id);
    return { data, error };
  },
  async levelUpHero(heroId) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('level_up_hero', { p_hero_id: heroId }));
    if (!error) { await this.loadHeroes(window.AuthState.user.id); await this.loadResources(window.AuthState.user.id); }
    return { data, error };
  },
  async starUpHero(heroId) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('star_up_hero', { p_hero_id: heroId }));
    if (!error) await this.loadHeroes(window.AuthState.user.id);
    return { data, error };
  },
  async upgradeGear(heroId, slot) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('upgrade_gear', { p_hero_id: heroId, p_slot: slot }));
    if (!error) { await this.loadHeroes(window.AuthState.user.id); await this.loadResources(window.AuthState.user.id); }
    return { data, error };
  },
  async upgradeTalent(heroId, talentId) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('upgrade_talent', { p_hero_id: heroId, p_talent_id: talentId }));
    if (!error) await this.loadHeroes(window.AuthState.user.id);
    return { data, error };
  },
  async claimHeroDevMission(heroId, stepIndex) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('claim_hero_dev_mission', { p_hero_id: heroId, p_step_index: stepIndex }));
    if (!error) { await this.loadHeroes(window.AuthState.user.id); await this.loadResources(window.AuthState.user.id); }
    return { data, error };
  },

  // ---- realtime + presence ------------------------------------------------

  _realtimeChannel: null,
  _heartbeatTimer: null,

  connectRealtime(uid) {
    if (this._realtimeChannel) return; // already connected this session
    this._realtimeChannel = window.supabaseClient
      .channel('public:app')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${uid}` },
        payload => {
          window.GameData.notifications.unshift(payload.new);
          window.GameData.unreadNotifications++;
          document.dispatchEvent(new CustomEvent('notifications:new', { detail: payload.new }));
        })
      .subscribe(status => {
        if (SUPABASE_DEBUG) console.log('[Realtime] app channel status:', status);
      });
  },

  startOnlineHeartbeat(uid) {
    if (this._heartbeatTimer) return;
    const ping = async () => {
      await safeCall(() => window.supabaseClient.from('profiles')
        .update({ last_seen: new Date().toISOString(), is_online: true })
        .eq('id', uid));
    };
    ping();
    this._heartbeatTimer = setInterval(ping, 45000); // every 45s, per spec §24 ("раз в 30–60 секунд")
    window.addEventListener('beforeunload', () => {
      // best-effort; browsers may not honour this, which is exactly why
      // last_seen (not is_online alone) is the thing other clients trust.
      navigator.sendBeacon && navigator.sendBeacon; // no-op placeholder, kept simple intentionally
    });
  }
};

function mskDateKeyISO() {
  const MSK_OFFSET_MS = 3 * 3600 * 1000;
  const d = new Date(Date.now() + MSK_OFFSET_MS);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
