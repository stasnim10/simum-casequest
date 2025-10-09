export const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForNextLevel = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * 100;
};

export const getXPProgress = (currentXP) => {
  const level = calculateLevel(currentXP);
  const xpInLevel = currentXP % 100;
  return (xpInLevel / 100) * 100;
};
