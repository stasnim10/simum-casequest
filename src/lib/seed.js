export function ensureSeededOnce(opts = {}) {
  const storeKey = opts.storeKey || 'casequest-storage';
  const flagKey = opts.seededFlagKey || 'cq_seeded_v1';

  const url = new URL(window.location.href);
  const params = url.searchParams;

  const forceReset = params.get('reset') === '1' || params.get('demo') === '1';
  if (forceReset) {
    try {
      localStorage.removeItem(flagKey);
      localStorage.removeItem(storeKey);
    } catch {}
  }

  let existing = null;
  try {
    existing = JSON.parse(localStorage.getItem(storeKey) || 'null');
  } catch {}

  const hasUser = !!(existing && existing.state && existing.state.user && existing.state.user.id);
  if (!forceReset && hasUser) return false;

  const today = new Date().toISOString().split('T')[0];
  const sample = {
    state: {
      user: {
        id: 'demo',
        name: 'Explorer',
        xp: 0,
        streak: 0,
        coins: 0,
        badges: [],
        dailyGoal: 20,
        dailyXP: 0,
        lastActiveDate: today,
        streakFreezeAvailable: true
      },
      lessonProgress: {},
      streakHistory: {},
      reviewItems: {}
    },
    version: 0
  };

  try {
    localStorage.setItem(storeKey, JSON.stringify(sample));
    localStorage.setItem(flagKey, '1');
  } catch {}

  if (params.get('demo') === '1') {
    params.delete('demo');
    params.delete('reset');
    window.history.replaceState(null, '', url.pathname + url.hash);
  }
  return true;
}
