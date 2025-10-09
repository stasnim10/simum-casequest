export function useFeedbackEnv() {
  const base = import.meta.env.VITE_API_BASE as string;
  const secret = import.meta.env.VITE_FEEDBACK_SECRET as string | undefined;
  return { base, secret };
}
