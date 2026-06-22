export default function AskAI({ compact = false }) {
  const features = [
    { icon: '📊', title: 'Campaign Intelligence', desc: 'Ask anything about spend, CTR, impressions, and ROAS across Meta, TikTok, and Google — instantly.' },
    { icon: '📈', title: 'Trend Analysis', desc: 'Spot what\'s working and what\'s not. Get plain-english breakdowns of your best and worst performing days.' },
    { icon: '🎯', title: 'Audience Insights', desc: 'Understand who\'s engaging, which creatives land, and where your budget is working hardest.' },
    { icon: '💡', title: 'Smart Recommendations', desc: 'Receive actionable suggestions tailored to your Boost Coffee data — no guesswork required.' },
  ]

  return (
    <div className={`flex flex-col ${compact ? 'h-[520px] overflow-y-auto' : 'max-w-3xl mx-auto'} px-1`}>

      {/* Hero */}
      <div className="flex flex-col items-center text-center pt-6 pb-4 gap-4">
        <div className="relative">
          <div className={`${compact ? 'w-12 h-12 text-2xl' : 'w-16 h-16 text-3xl'} rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30`}>
            ✦
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-400 border-2 border-gray-900 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">!</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Coming Soon</span>
          </div>
          <h2 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white leading-tight`}>
            Your AI Marketing Analyst
          </h2>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-400 mt-2 max-w-md`}>
            Ask anything. Get answers in seconds. Powered by Gemini — the same AI behind Google Search.
          </p>
        </div>

        {!compact && (
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs text-purple-300 font-medium">Actively being built · Check back soon</span>
          </div>
        )}
      </div>

      {/* Feature grid */}
      <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'} mt-2`}>
        {features.map((f, i) => (
          <div key={i} className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">{f.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white">{f.title}</p>
              {!compact && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <p className={`text-center text-xs text-gray-600 ${compact ? 'mt-4 pb-4' : 'mt-6'}`}>
        Powered by Google Gemini · Built exclusively for Boost Coffee & Energy
      </p>
    </div>
  )
}
