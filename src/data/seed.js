export const seedDemoData = () => {
  const demoUser = {
    id: 'demo',
    name: 'Demo',
    xp: 120,
    streak: 3,
    coins: 50,
    badges: ['🎯', '🔥', '⭐']
  };
  
  const demoProgress = {
    '1': { status: 'mastered', crownLevel: 3 },
    '2': { status: 'in_progress', crownLevel: 1 }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
  
  const demoStreakHistory = {
    [twoDaysAgo]: true,
    [yesterday]: true,
    [today]: true
  };
  
  localStorage.setItem('casequest-storage', JSON.stringify({
    state: { 
      user: demoUser,
      lessonProgress: demoProgress,
      streakHistory: demoStreakHistory
    },
    version: 0
  }));
  
  return demoUser;
};
