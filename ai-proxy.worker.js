/* ============================================================
   AI PROXY  ·  Danish Reza portfolio console
   ------------------------------------------------------------
   Purpose: hold your Anthropic API key server-side so the live
   model can answer on your public (static) GitHub Pages site.
   Never put a raw API key in index.html — anyone could read it.

   ------------------------------------------------------------
   DEPLOY (free, ~5 minutes) — Cloudflare Workers
   ------------------------------------------------------------
   1. Go to https://workers.cloudflare.com  →  Create Worker.
   2. Replace the default code with THIS file. Save & Deploy.
   3. Add your key as a secret (Settings → Variables → Add secret):
         Name:  ANTHROPIC_API_KEY
         Value: sk-ant-...        (get one at console.anthropic.com)
      (CLI alternative:  npx wrangler secret put ANTHROPIC_API_KEY)
   4. Copy your Worker URL, e.g.
         https://danish-ai.<your-subdomain>.workers.dev
   5. In index.html, set:
         const LLM_ENDPOINT = 'https://danish-ai.<your-subdomain>.workers.dev';
      Commit, push — the live model now answers on your site.

   Cost: uses Claude Haiku by default (very cheap, plenty for a
   short profile Q&A). Bump MODEL to a Sonnet string if you want.
   Model names change over time — confirm the current one at
   https://docs.claude.com/en/docs/about-claude/models
   ============================================================ */

// Model the proxy will call. Set to whatever your API key supports.
const MODEL = 'claude-haiku-4-5-20251001';

// Lock this down to your site once it works. During testing '*' is fine.
const ALLOW_ORIGIN = 'https://danish-ctrl.github.io';

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }));
    }
    if (request.method !== 'POST') {
      return withCors(new Response('POST only', { status: 405 }));
    }
    if (!env.ANTHROPIC_API_KEY) {
      return withCors(json({ error: 'Server missing ANTHROPIC_API_KEY secret' }, 500));
    }

    try {
      const body = await request.json();

      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: Math.min(Number(body.max_tokens) || 1000, 1024),
          system: typeof body.system === 'string' ? body.system : undefined,
          messages: Array.isArray(body.messages) ? body.messages : [],
        }),
      });

      const text = await upstream.text();
      return withCors(new Response(text, {
        status: upstream.status,
        headers: { 'content-type': 'application/json' },
      }));
    } catch (err) {
      return withCors(json({ error: String(err) }, 500));
    }
  },
};

function withCors(res) {
  res.headers.set('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'content-type');
  res.headers.set('Vary', 'Origin');
  return res;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
