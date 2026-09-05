// js/quests.js
//
// Daily PvP missions (and, later, other quest types) live in `quests` +
// `quest_progress`. Progress itself is only ever written by
// report_pvp_daily_progress() (called from inside resolve_pvp_battle_bot,
// see schema.sql) — this file never sets `progress` or `completed`
// directly, only reads them and calls claim_quest() once they're true.

window.Quests = {
  today() {
    return window.GameData.quests || [];
  },

  progressPct(qp) {
    const target = qp.target || qp.quests?.target || 1;
    return Math.min(100, Math.round((qp.progress / target) * 100));
  },

  canClaim(qp) {
    return qp.progress >= (qp.target || qp.quests?.target || 1) && !qp.claimed;
  },

  async claim(questProgressRow) {
    const { data, error } = await safeCall(() =>
      window.supabaseClient.rpc('claim_quest', {
        p_quest_id: questProgressRow.quest_id,
        p_period_key: questProgressRow.period_key
      })
    );
    if (!error) {
      await Promise.all([
        window.Database.loadTodayQuests(),
        window.Database.loadResources(window.AuthState.user.id),
        window.Database.loadHeroes(window.AuthState.user.id),
        window.Database.loadProfile(window.AuthState.user.id),
        window.Database.loadPvpRating(window.AuthState.user.id)
      ]);
    }
    return { data, error };
  }
};
