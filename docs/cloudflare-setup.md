# Cloudflare Setup for api.casequestapp.com

## A) DNS + SSL Configuration

1. Log in to Cloudflare Dashboard
2. Select domain: `casequestapp.com`
3. Go to DNS → Records
4. Add CNAME record:
   - **Type**: CNAME
   - **Name**: `api`
   - **Target**: `casequest-api.onrender.com`
   - **Proxy status**: Proxied (orange cloud icon)
   - **TTL**: Auto
5. Click "Save"
6. Wait 2-5 minutes for DNS propagation

Verify:
```bash
dig api.casequestapp.com
# Should show Cloudflare IPs (104.x.x.x or 172.x.x.x)
```

## B) Transform Rules - CORS Headers

1. Go to Rules → Transform Rules → Modify Response Header
2. Click "Create rule"
3. Rule name: `API CORS Headers`
4. When incoming requests match:
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `api.casequestapp.com`
5. Then:
   - **Set static** `Access-Control-Allow-Origin` = `https://www.casequestapp.com`
   - **Set static** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
   - **Set static** `Access-Control-Allow-Headers` = `Content-Type, Authorization`
   - **Set static** `Access-Control-Max-Age` = `600`
6. Click "Deploy"

## C) Cache Rules

### Rule 1: Cache Health Endpoint

1. Go to Caching → Cache Rules
2. Click "Create rule"
3. Rule name: `Cache API Health`
4. When incoming requests match:
   - Field: `URI Path`
   - Operator: `equals`
   - Value: `/api/health`
   - AND
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `api.casequestapp.com`
5. Then:
   - **Cache eligibility**: Eligible for cache
   - **Edge TTL**: 60 seconds
6. Click "Deploy"

### Rule 2: Bypass Cache for POST

1. Create another Cache Rule
2. Rule name: `Bypass POST Requests`
3. When incoming requests match:
   - Field: `Request Method`
   - Operator: `equals`
   - Value: `POST`
   - AND
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `api.casequestapp.com`
4. Then:
   - **Cache eligibility**: Bypass cache
5. Click "Deploy"

## D) Alternative: Cloudflare Worker (Recommended)

If you prefer more control, use a Worker instead of Rules:

1. Go to Workers & Pages → Create Worker
2. Name: `casequest-proxy`
3. Replace code with:

```javascript
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const upstream = new URL(req.url);
    upstream.hostname = "casequest-api.onrender.com";

    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://www.casequestapp.com",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "600"
    };

    // Handle preflight
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // Cache health endpoint
    const isHealth = url.pathname === "/api/health";
    if (isHealth && req.method === "GET") {
      const cache = caches.default;
      const cacheKey = new Request(upstream.toString(), { method: "GET" });
      let resp = await cache.match(cacheKey);
      
      if (!resp) {
        const upstreamResp = await fetch(upstream.toString(), { method: "GET" });
        resp = new Response(upstreamResp.body, upstreamResp);
        resp.headers.set("Cache-Control", "public, max-age=60");
        ctx.waitUntil(cache.put(cacheKey, resp.clone()));
      }
      
      Object.entries(corsHeaders).forEach(([k, v]) => resp.headers.set(k, v));
      return resp;
    }

    // Proxy all other requests
    const proxied = await fetch(upstream.toString(), {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
      redirect: "follow"
    });

    const out = new Response(proxied.body, proxied);
    Object.entries(corsHeaders).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  }
};
```

4. Click "Save and Deploy"
5. Go to Workers & Pages → casequest-proxy → Settings → Triggers
6. Add Custom Domain: `api.casequestapp.com`
7. Click "Add Custom Domain"

## Verification

### DNS Resolution
```bash
dig api.casequestapp.com
# Should return Cloudflare IPs
```

### Health Check
```bash
curl -I https://api.casequestapp.com/api/health
# Should return 200 OK with Cache-Control header
```

### CORS Headers
```bash
curl -I -X OPTIONS https://api.casequestapp.com/api/feedback \
  -H "Origin: https://www.casequestapp.com"
# Should include Access-Control-Allow-Origin header
```

### Full Feedback Test
```bash
curl -X POST https://api.casequestapp.com/api/feedback \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.casequestapp.com" \
  -d '{"userId":"demo","caseId":"profitability-001","steps":{"clarifying":[],"hypothesis":"test","structure":"Profitability","quant":{},"recommendation":"test"}}'
# Should return JSON feedback with CORS headers
```

## Troubleshooting

### DNS not resolving
- Wait 5-10 minutes for propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (macOS)

### CORS errors
- Verify Transform Rules are deployed
- Check rule order (CORS rules should be first)
- Ensure origin matches exactly (no trailing slash)

### Cache not working
- Check Cache Rules are deployed
- Verify Edge TTL is set
- Test with curl -I to see Cache-Control headers

### Worker not routing
- Verify Custom Domain is added to Worker
- Check Worker logs for errors
- Ensure DNS CNAME is still proxied (orange cloud)
