import { useState, useRef, useEffect } from 'react'

const WORKER_URL = 'https://boost-gemini.aubrianna.workers.dev'

const SUGGESTED = [
  'Which Meta campaign had the best CTR this period?',
  'How much did we spend on TikTok vs Meta?',
  'What were our total impressions across all platforms?',
  'Which day had the highest Instagram reach?',
  'How many new followers did we gain on Instagram?',
]

function buildContext({ meta, ig, tiktok }) {
  const sum = (arr, f) => arr.reduce((s, r) => s + (r[f] || 0), 0)

  // Meta totals
  const mSpend  = sum(meta, 'spend')
  const mImpr   = sum(meta, 'impressions')
  const mClicks = sum(meta, 'clicks')
  const mReach  = sum(meta, 'reach')

  // Meta by campaign
  const byCampaign = {}
  meta.forEach(r => {
    if (!byCampaign[r.campaign]) byCampaign[r.campaign] = { spend: 0, impressions: 0, clicks: 0, reach: 0, status: r.status }
    byCampaign[r.campaign].spend       += r.spend || 0
    byCampaign[r.campaign].impressions += r.impressions || 0
    byCampaign[r.campaign].clicks      += r.clicks || 0
    byCampaign[r.campaign].reach       += r.reach || 0
  })
  const campaignLines = Object.entries(byCampaign).map(([name, d]) =>
    `  - ${name} [${d.status}]: $${d.spend.toFixed(2)} spend, ${d.impressions.toLocaleString()} impressions, ${d.clicks.toLocaleString()} clicks, CTR ${d.impressions > 0 ? ((d.clicks/d.impressions)*100).toFixed(2) : 0}%`
  ).join('\n')

  // TikTok totals
  const tSpend  = sum(tiktok, 'spend')
  const tImpr   = sum(tiktok, 'impressions')
  const tClicks = sum(tiktok, 'clicks')

  // TikTok by campaign
  const byTTCampaign = {}
  tiktok.forEach(r => {
    if (!byTTCampaign[r.campaign_name]) byTTCampaign[r.campaign_name] = { spend: 0, impressions: 0, status: r.status }
    byTTCampaign[r.campaign_name].spend       += r.spend || 0
    byTTCampaign[r.campaign_name].impressions += r.impressions || 0
  })
  const ttLines = Object.entries(byTTCampaign).map(([name, d]) =>
    `  - ${name} [${d.status}]: $${d.spend.toFixed(2)} spend, ${d.impressions.toLocaleString()} impressions`
  ).join('\n')

  // Instagram totals
  const igReach     = sum(ig, 'reach')
  const igViews     = sum(ig, 'views')
  const igFollowers = ig.reduce((s, r) => s + (r.new_followers || 0), 0)
  const igEngagement = sum(ig, 'likes') + sum(ig, 'comments') + sum(ig, 'saves')

  const dateMin = meta[0]?.date || ig[0]?.date || 'N/A'
  const dateMax = meta[meta.length - 1]?.date || ig[ig.length - 1]?.date || 'N/A'

  return `
REPORTING PERIOD: ${dateMin} to ${dateMax}

META ADS (Facebook & Instagram Paid):
- Total Spend: $${mSpend.toFixed(2)}
- Total Impressions: ${mImpr.toLocaleString()}
- Total Reach: ${mReach.toLocaleString()}
- Total Clicks: ${mClicks.toLocaleString()}
- Overall CTR: ${mImpr > 0 ? ((mClicks/mImpr)*100).toFixed(2) : 0}%
- Overall CPM: $${mImpr > 0 ? ((mSpend/mImpr)*1000).toFixed(2) : 0}
Campaigns:
${campaignLines}

TIKTOK ADS:
- Total Spend: $${tSpend.toFixed(2)}
- Total Impressions: ${tImpr.toLocaleString()}
- Total Clicks: ${tClicks.toLocaleString()}
Campaigns:
${ttLines}

INSTAGRAM ORGANIC:
- Total Reach: ${igReach.toLocaleString()}
- Total Views: ${igViews.toLocaleString()}
- New Followers (recent period): ${igFollowers.toLocaleString()}
- Total Engagement (likes + comments + saves): ${igEngagement.toLocaleString()}

COMBINED PAID SPEND: $${(mSpend + tSpend).toFixed(2)}
COMBINED PAID IMPRESSIONS: ${(mImpr + tImpr).toLocaleString()}
`.trim()
}

function Message({ role, text }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
        isUser ? 'bg-orange-500 text-white' : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
      }`}>
        {isUser ? 'B' : '✦'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-orange-500 text-white rounded-tr-sm'
          : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-sm'
      }`}>
        {text.split('\n').map((line, i) => (
          <span key={i}>{line}{i < text.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">✦</div>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

export default function AskAI({ meta, ig, tiktok, compact = false }) {
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const ask = async (question) => {
    if (!question.trim() || loading) return
    const q = question.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)

    try {
      const context = buildContext({ meta, ig, tiktok })
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className={`flex flex-col ${compact ? 'h-[520px]' : 'h-[calc(100vh-180px)] max-w-3xl mx-auto'}`}>

      {/* Welcome screen */}
      {isEmpty && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-6">
          {/* Gemini-style gradient orb */}
          <div className="relative">
            <div className={`${compact ? 'w-12 h-12 text-2xl' : 'w-20 h-20 text-4xl'} rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30`}>
              ✦
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 blur-xl opacity-30 scale-150" />
          </div>

          <div className="text-center space-y-2">
            <h2 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white`}>Ask me anything</h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Powered by Google Gemini · I have access to all your Boost Coffee dashboard data and can answer questions about your campaigns, spend, reach, and more.
            </p>
          </div>

          {/* Suggested questions */}
          <div className="w-full space-y-2">
            <p className="text-xs text-gray-500 text-center uppercase tracking-wider mb-3">Try asking</p>
            {SUGGESTED.slice(0, compact ? 2 : 3).map((q, i) => (
              <button
                key={i}
                onClick={() => ask(q)}
                className="w-full text-left bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 text-sm text-gray-300 hover:text-white transition-all duration-150 flex items-center justify-between group"
              >
                <span>{q}</span>
                <span className="text-gray-600 group-hover:text-gray-400 text-lg">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message thread */}
      {!isEmpty && (
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {messages.map((m, i) => <Message key={i} role={m.role} text={m.text} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input bar */}
      <div className="pt-4 border-t border-gray-800">
        {!isEmpty && (
          <div className="flex gap-2 flex-wrap mb-3">
            {SUGGESTED.slice(0, 2).map((q, i) => (
              <button
                key={i}
                onClick={() => ask(q)}
                disabled={loading}
                className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-3 py-1 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-gray-900 border border-gray-700 focus-within:border-purple-500 rounded-2xl px-4 py-3 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input) } }}
              placeholder="Ask about your campaigns, spend, reach, followers…"
              rows={1}
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none resize-none"
              style={{ maxHeight: '120px' }}
              disabled={loading}
            />
          </div>
          <button
            onClick={() => ask(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-40 flex items-center justify-center transition-all flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">Powered by Google Gemini · Data reflects your selected date range</p>
      </div>
    </div>
  )
}
