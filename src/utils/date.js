export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getDaysSince = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = now - past;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
