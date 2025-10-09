let initialized = false;

export function initAnalytics(key?: string, host?: string) {
  if (!key) {
    console.warn('PostHog disabled: missing key');
    return;
  }
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, { api_host: host || 'https://app.posthog.com', capture_pageview: true });
    (window as any).posthog = posthog;
    initialized = true;
    console.log('PostHog initialized');
  }).catch(err => console.error('PostHog init failed', err));
}

export function track(name: string, props?: Record<string, any>) {
  const ph = (window as any).posthog;
  if (!ph) return;
  ph.capture(name, props);
}

export function identify(userId: string, traits?: Record<string, any>) {
  const ph = (window as any).posthog;
  if (!ph) return;
  ph.identify(userId, traits);
}
