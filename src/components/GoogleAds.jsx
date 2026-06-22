export default function GoogleAds() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-6">
        {/* Google logo colors */}
        <div className="flex gap-1 text-4xl font-bold">
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
          <span className="text-white ml-2">Ads</span>
        </div>

        <p className="text-gray-400 max-w-md">
          Google Ads is not connected yet. Follow these steps to add it — it takes about 2 minutes.
        </p>

        <div className="bg-gray-800 rounded-xl p-6 text-left w-full max-w-lg space-y-4">
          <h3 className="font-semibold text-white mb-2">How to connect Google Ads</h3>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <p className="text-sm text-gray-200 font-medium">Go to Windsor.ai</p>
              <p className="text-xs text-gray-400">Open <span className="text-orange-400">windsor.ai</span> and sign in with the same account (admin@boostcoffee.com)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <p className="text-sm text-gray-200 font-medium">Click "Add Connector"</p>
              <p className="text-xs text-gray-400">Look for the blue "+ Add Connector" button on your dashboard</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <p className="text-sm text-gray-200 font-medium">Search for "Google Ads" and connect</p>
              <p className="text-xs text-gray-400">Sign in with the Google account that manages your Boost Coffee Google Ads</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">4</div>
            <div>
              <p className="text-sm text-gray-200 font-medium">Come back here and say "refresh data"</p>
              <p className="text-xs text-gray-400">I'll pull in all your Google Ads campaigns (Search, Display, YouTube) and update this tab automatically</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Once connected, this tab will show: campaigns → ad groups → ads, impressions, spend, clicks, conversions, and more.
        </div>
      </div>
    </div>
  )
}
