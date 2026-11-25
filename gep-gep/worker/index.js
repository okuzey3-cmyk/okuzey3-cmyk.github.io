/* v2 */
/* Gep Gep — yapay zeka aracısı (Cloudflare Worker)
   Telefondaki uygulama bu adrese istek atar; Gemini anahtarı yalnızca burada, gizli kasada durur. */
const ORIGINS = ['https://okuzey3-cmyk.github.io'];
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
const MAX_BYTES = 6 * 1024 * 1024;

const cors = origin => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
});
const reply = (obj, status, origin) =>
  new Response(JSON.stringify(obj), {status, headers: {'Content-Type': 'application/json', ...cors(origin)}});

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    if (!ORIGINS.includes(origin)) return new Response('forbidden', {status: 403});
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors(origin)});
    if (req.method !== 'POST') return reply({error: 'method'}, 405, origin);

    // kullanıcı başına dakikalık sınır
    if (env.LIMITER) {
      const ip = req.headers.get('CF-Connecting-IP') || 'anon';
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return reply({error: 'rate'}, 429, origin);
    }

    const len = +req.headers.get('Content-Length') || 0;
    if (len > MAX_BYTES) return reply({error: 'big'}, 413, origin);
    let data;
    try { data = await req.json(); } catch (e) { return reply({error: 'json'}, 400, origin); }
    const { model, body } = data || {};
    if (!MODELS.includes(model) || !body || !Array.isArray(body.contents)) return reply({error: 'bad'}, 400, origin);
    if (!env.GEMINI_API_KEY) return reply({error: 'nokey'}, 500, origin);

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY},
      body: JSON.stringify({contents: body.contents, generationConfig: body.generationConfig || {}})
    });
    return new Response(await r.text(), {status: r.status, headers: {'Content-Type': 'application/json', ...cors(origin)}});
  }
};
