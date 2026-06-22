import { useState } from 'react'
import Overview from './components/Overview'
import MetaAds from './components/MetaAds'
import InstagramOrganic from './components/InstagramOrganic'
import TikTokAds from './components/TikTokAds'
import Demographics from './components/Demographics'
import GoogleAds from './components/GoogleAds'
import { metaAdsRaw, igOrganicRaw, tiktokAdsRaw, lastRefreshed } from './data/index'

const TABS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'meta',          label: 'Meta Ads' },
  { id: 'ig',            label: 'IG Organic' },
  { id: 'tiktok',        label: 'TikTok Ads' },
  { id: 'google',        label: 'Google Ads' },
  { id: 'demographics',  label: 'Demographics' },
]

export default function App() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-sm">B</div>
          <div>
            <h1 className="text-lg font-semibold text-white">Boost Coffee</h1>
            <p className="text-xs text-gray-400">Social Media Performance · Last 30 Days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            Refreshed {lastRefreshed}
          </span>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">Live via Windsor.ai</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 flex gap-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              tab === t.id
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {t.label}
            {t.id === 'google' && (
              <span className="ml-1.5 text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">Setup</span>
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="p-6 max-w-screen-xl mx-auto">
        {tab === 'overview'     && <Overview meta={metaAdsRaw} ig={igOrganicRaw} tiktok={tiktokAdsRaw} />}
        {tab === 'meta'         && <MetaAds data={metaAdsRaw} />}
        {tab === 'ig'           && <InstagramOrganic data={igOrganicRaw} />}
        {tab === 'tiktok'       && <TikTokAds data={tiktokAdsRaw} />}
        {tab === 'google'       && <GoogleAds />}
        {tab === 'demographics' && <Demographics />}
      </main>
    </div>
  )
}
