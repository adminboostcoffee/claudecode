// Boost Coffee – Gemini AI chatbot proxy
// Deploy to Cloudflare Workers, set GEMINI_API_KEY as a secret

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS })

    const { question, context } = await request.json()

    const prompt = `You are a smart, friendly marketing analytics assistant for Boost Coffee & Energy — a coffee and energy drink brand. You have access to their real social media and app performance data below.

DATA SUMMARY:
${context}

Guidelines:
- Answer clearly and concisely using the actual numbers from the data above
- Be conversational but professional
- If a metric isn't in the data, say so honestly
- Format numbers nicely (e.g. "$1,815" not "1815.736")
- Keep answers under 150 words unless a detailed breakdown is requested
- If asked about trends, reference specific dates or campaigns from the data

User question: ${question}`

    const res = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    })

    const data = await res.json()
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Sorry, I couldn\'t generate a response. Please try again.'

    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  },
}
