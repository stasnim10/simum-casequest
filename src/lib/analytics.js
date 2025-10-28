export function initAnalytics(key, host = 'https://app.posthog.com') {
  if (!key) {
    console.warn('PostHog disabled: missing key');
    return;
  }
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, { api_host: host, capture_pageview: true });
    window.posthog = posthog;
    console.log('PostHog initialized');
  }).catch(err => console.error('PostHog init failed', err));
}

export function track(event, props) {
  const ph = window.posthog;
  if (!ph) return;
  ph.capture(event, props);
}

export function identify(id, traits) {
  const ph = window.posthog;
  if (!ph) return;
  ph.identify(id, traits);
}
