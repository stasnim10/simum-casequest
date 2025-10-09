// Spaced repetition schedule in days
const SCHEDULE = [1, 3, 7, 14];

export const calculateNextReview = (quality, currentInterval = 0) => {
  // quality: 0-5 (0=wrong, 5=perfect)
  // Returns next review date and new interval index
  
  let nextIntervalIndex;
  
  if (quality < 3) {
    // Failed - restart from beginning
    nextIntervalIndex = 0;
  } else if (quality >= 4) {
    // Good - advance to next interval
    nextIntervalIndex = Math.min(currentInterval + 1, SCHEDULE.length - 1);
  } else {
    // Okay - stay at current interval
    nextIntervalIndex = currentInterval;
  }
  
  const daysUntilNext = SCHEDULE[nextIntervalIndex];
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNext);
  
  return {
    nextReviewDate: nextReviewDate.toISOString().split('T')[0],
    intervalIndex: nextIntervalIndex
  };
};

export const getDueItems = (reviewItems) => {
  const today = new Date().toISOString().split('T')[0];
  
  return Object.entries(reviewItems)
    .filter(([_, item]) => item.nextReview <= today)
    .map(([id, item]) => ({ id, ...item }))
    .slice(0, 5); // Max 5 items per session
};

export const isItemDue = (item) => {
  if (!item || !item.nextReview) return false;
  const today = new Date().toISOString().split('T')[0];
  return item.nextReview <= today;
};
