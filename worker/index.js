// Boost Coffee – Appfront proxy worker
// Deploy this on Cloudflare Workers (free tier)
// Set APPFRONT_TOKEN as an environment variable/secret in the Cloudflare dashboard

const ENDPOINT = 'https://gqlapi.appfront.ai/graphql'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS })
    }

    const token = env.APPFRONT_TOKEN
    if (!token) {
      return new Response(JSON.stringify({ error: 'APPFRONT_TOKEN secret not set' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...CORS }
      })
    }

    const body = await request.text()

    const upstream = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'Origin': 'https://portal.appfront.ai',
        'Referer': 'https://portal.appfront.ai/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body,
    })

    const data = await upstream.text()
    return new Response(data, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  },
}
