// js/pvp.js
//
// IMPORTANT ARCHITECTURE NOTE (read this before touching battle code):
//
// The existing client has a full local turn-based battle engine
// (Battle.performAttack, abilities, counter-classes, talents — see the
// game's own <script>). That engine is GREAT for the moment-to-moment
// feel of a fight and is kept as-is for that purpose.
//
// But per the spec (§18/§30): the server must never just accept
// `winner_id` from the client. So the authority for "who actually won,
// what the rating change is, and what gets paid out" moves to the
// resolve_pvp_battle_bot() Postgres function in schema.sql. That
// function:
//   - reads YOUR hero's power from player_heroes.power (a column the
//     client cannot write to directly — it's only ever set by
//     recompute_player_hero(), itself only called from inside the
//     other trusted RPCs), so a modified client can't just claim "my
//     power is 999999" before starting a fight;
//   - rolls its own bot opponent power and its own win/loss outcome
//     server-side;
//   - is the only thing that ever changes pvp_rating / profiles.rating /
//     credits / pvp_battles / daily-quest progress for a fight.
//
// The recommended flow, and the one wired up below:
//   1. Call PvP.findOpponents() to get a same-power-band bot to show in
//      the "choose your opponent" list (this is cosmetic — it decides
//      what NAME/HERO SKIN shows up, not the outcome).
//   2. Call PvP.fight(heroId) when the player presses "В БОЙ". This
//      calls resolve_pvp_battle_bot() and gets back an authoritative
//      result (win/loss, rating change, damage numbers, turns, reward).
//   3. Feed that result into the EXISTING client-side Battle module as
//      a script to animate/replay (see renderServerDecidedBattle below
//      for the integration point), so the fight still feels interactive
//      even though the server already knows how it ends.
//
// This is a deliberate, documented trade-off: turn-by-turn player
// choices (attack/ability/defend/ultimate) are not yet round-tripped to
// the server per-action (that would need one RPC call per turn). What's
// closed today is the part that actually pays out — rating and rewards
// can't be forged by editing client JS.

window.PvP = {
  currentOpponents: [],
  searchState: { date: null, used: 0 },

  async loadSearchState() {
    // Search-attempt limits live in quest_progress-style bookkeeping in
    // this v1: we simply count today's pvp_battles rows as "attempts used".
    const today = mskDateKeyISO();
    const result = await safeCall(() =>
      window.supabaseClient
        .from('pvp_battles')
        .select('id', { count: 'exact', head: true })
        .eq('attacker_id', window.AuthState.user.id)
        .gte('created_at', `${today}T00:00:00Z`)
    );
    this.searchState = { date: today, used: result.error ? 0 : (result.count ?? 0) };
    return this.searchState;
  },

  /**
   * Cosmetic opponent search — picks a bot "skin" (name + hero) whose
   * power roughly matches the player's own SERVER-STORED hero power.
   * Nothing here is trusted for payouts; see the module doc comment.
   */
  findOpponents(myHeroId) {
    const heroEntry = window.GameData.heroes.find(h => h.def.id === myHeroId);
    const myPower = heroEntry?.playerHero?.power || 0;
    const pool = ['VALENTIN', 'KIRA', 'NOMAD', 'ASH', 'ROOK', 'VESNA', 'GRIM', 'TALON', 'ORCA', 'LYRA'];
    const heroSkins = window.GameData.heroes.map(h => h.def);

    this.currentOpponents = Array.from({ length: 5 }, () => {
      const skin = heroSkins[Math.floor(Math.random() * heroSkins.length)];
      const variance = 0.85 + Math.random() * 0.3;
      const power = Math.max(400, Math.round(myPower * variance));
      return {
        name: pool[Math.floor(Math.random() * pool.length)],
        heroName: skin.name,
        role: skin.role,
        power
      };
    });
    return this.currentOpponents;
  },

  /**
   * The one call that actually matters. Returns the server's
   * authoritative outcome. `heroId` must be one of the caller's own
   * unlocked heroes (enforced inside the RPC).
   */
  async fight(heroId) {
    const { data, error } = await safeCall(() => window.supabaseClient.rpc('resolve_pvp_battle_bot', { p_hero_id: heroId }));
    if (error) return { data: null, error };

    // Refresh everything the fight could have touched.
    await Promise.all([
      window.Database.loadResources(window.AuthState.user.id),
      window.Database.loadPvpRating(window.AuthState.user.id),
      window.Database.loadHeroes(window.AuthState.user.id),
      window.Database.loadTodayQuests()
    ]);

    return { data, error: null };
  },

  async loadHistory(limit = 30) {
    const uid = window.AuthState.user.id;
    const { data, error } = await safeCall(() =>
      window.supabaseClient
        .from('pvp_battles')
        .select('*')
        .or(`attacker_id.eq.${uid},defender_id.eq.${uid}`)
        .order('created_at', { ascending: false })
        .limit(limit)
    );
    return { data: data || [], error };
  },

  tierName(rating) {
    const tiers = [
      { min: 0, name: 'БРОНЗА' }, { min: 1000, name: 'СЕРЕБРО' }, { min: 1200, name: 'ЗОЛОТО' },
      { min: 1450, name: 'ПЛАТИНА' }, { min: 1700, name: 'АЛМАЗ' }, { min: 2000, name: 'МАСТЕР' }
    ];
    let t = tiers[0];
    tiers.forEach(tier => { if (rating >= tier.min) t = tier; });
    return t.name;
  },

  /**
   * Integration point: turns a resolve_pvp_battle_bot() result into a
   * turn log the existing local Battle-screen renderer can play back,
   * ending on the server-decided winner regardless of what the
   * intermediate animated turns show. Wire this into your Battle.start
   * flow (see index.html patch notes) in place of the fully-local
   * simulation's outcome.
   */
  buildReplayLog(serverResult) {
    const lines = [];
    lines.push({ text: `Бой начался. Сила соперника: ${serverResult.bot_power}.`, cls: '' });
    lines.push({ text: `Ходов: ${serverResult.turns}. Крит. ударов: ${serverResult.crits}.`, cls: '' });
    lines.push({
      text: serverResult.result === 'win' ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ.',
      cls: serverResult.result === 'win' ? 'me' : 'enemy'
    });
    return lines;
  }
};

async function loadPagedLeaderboard(page = 0, pageSize = 20) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await safeCall(() =>
    window.supabaseClient
      .from('profiles')
      .select('id, username, avatar_url, level, rating, wins, losses, alliance_tag')
      .order('rating', { ascending: false })
      .range(from, to)
  );
  return { data: data || [], error };
}
window.loadPagedLeaderboard = loadPagedLeaderboard;
