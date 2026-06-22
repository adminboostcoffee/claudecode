export default function GoogleAds() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center text-center gap-6 max-w-sm">

        <div className="flex gap-0.5 text-5xl font-bold tracking-tight select-none">
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
          <span className="text-white ml-2">Ads</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs text-gray-300 font-medium tracking-wide">Integration in progress</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Coming soon</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Google Ads data is on the way. Search, Display, and YouTube campaign performance will appear here once the integration is live.
          </p>
        </div>

      </div>
    </div>
  )
}
