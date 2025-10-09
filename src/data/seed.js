export const seedDemoData = () => {
  const demoUser = {
    xp: 120,
    streak: 3,
    coins: 50,
    level: 2,
    badges: ['🎯', '🔥', '⭐']
  };
  
  localStorage.setItem('casequest-storage', JSON.stringify({
    state: { user: demoUser },
    version: 0
  }));
  
  return demoUser;
};
