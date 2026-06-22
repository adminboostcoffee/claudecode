import { useState, useMemo } from 'react'
import Overview from './components/Overview'
import MetaAds from './components/MetaAds'
import InstagramOrganic from './components/InstagramOrganic'
import TikTokAds from './components/TikTokAds'
import Demographics from './components/Demographics'
import GoogleAds from './components/GoogleAds'
import AskAI from './components/AskAI'
import Appfront from './components/Appfront'
import PasswordGate from './components/PasswordGate'
import { metaAdsRaw, igOrganicRaw, tiktokAdsRaw, lastRefreshed } from './data/index'

const DATA_MIN = '2026-04-01'
const DATA_MAX = '2026-06-21'

const TABS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'meta',          label: 'Meta Ads' },
  { id: 'ig',            label: 'IG Organic' },
  { id: 'tiktok',        label: 'TikTok Ads' },
  { id: 'demographics',  label: 'Demographics' },
  { id: 'appfront',      label: 'Appfront' },
  { id: 'google',        label: 'Google Ads' },
]

function fmtDateLabel(d) {
  const [, m, day] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m) - 1]} ${parseInt(day)}`
}

export default function App() {
  const [tab, setTab]         = useState('overview')
  const [startDate, setStart] = useState(DATA_MIN)
  const [endDate,   setEnd]   = useState(DATA_MAX)

  const metaFiltered = useMemo(() =>
    metaAdsRaw.filter(r => r.date >= startDate && r.date <= endDate)
  , [startDate, endDate])

  const igFiltered = useMemo(() =>
    igOrganicRaw.filter(r => r.date >= startDate && r.date <= endDate)
  , [startDate, endDate])

  const tiktokFiltered = useMemo(() =>
    tiktokAdsRaw.filter(r => r.date >= startDate && r.date <= endDate)
  , [startDate, endDate])

  const dateLabel = `${fmtDateLabel(startDate)} – ${fmtDateLabel(endDate)}, 2026`
  const isFullRange = startDate === DATA_MIN && endDate === DATA_MAX

  const [aiOpen, setAiOpen] = useState(false)

  return (
    <PasswordGate>
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Boost Coffee + Energy logo */}
          <div className="flex flex-col leading-none select-none">
            <div className="flex items-center gap-0" style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.01em', fontFamily: "'Montserrat', sans-serif" }}>
              <span style={{ color: '#F5C200' }}>⚡</span>
              <span style={{ color: '#1EC8C8' }}>BOOST</span>
            </div>
            <div style={{ color: '#F5C200', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.14em', fontFamily: "'Montserrat', sans-serif" }}>
              COFFEE + ENERGY
            </div>
          </div>
          <div className="w-px h-8 bg-gray-700 flex-shrink-0" />
          <p className="text-xs text-gray-400 leading-tight">Social Media<br/>Performance</p>
        </div>

        {/* Date range picker — prominent, always visible */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-xl px-1 py-1">
            <div className="flex items-center gap-1.5 px-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">From</span>
              <input
                type="date"
                value={startDate}
                min={DATA_MIN}
                max={endDate}
                onChange={e => setStart(e.target.value)}
                className="bg-transparent text-sm text-white outline-none cursor-pointer"
              />
            </div>
            <span className="text-gray-600">→</span>
            <div className="flex items-center gap-1.5 px-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">To</span>
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={DATA_MAX}
                onChange={e => setEnd(e.target.value)}
                className="bg-transparent text-sm text-white outline-none cursor-pointer"
              />
            </div>
            {!isFullRange && (
              <button
                onClick={() => { setStart(DATA_MIN); setEnd(DATA_MAX) }}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                title="Reset to full range"
              >
                ✕ Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-xl px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-orange-300 font-medium whitespace-nowrap">{dateLabel}</span>
          </div>

          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-xl whitespace-nowrap">
            Refreshed {lastRefreshed}
          </span>
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
        {tab === 'overview'     && <Overview meta={metaFiltered} ig={igFiltered} tiktok={tiktokFiltered} />}
        {tab === 'meta'         && <MetaAds data={metaFiltered} />}
        {tab === 'ig'           && <InstagramOrganic data={igFiltered} />}
        {tab === 'tiktok'       && <TikTokAds data={tiktokFiltered} />}
        {tab === 'google'       && <GoogleAds />}
        {tab === 'demographics' && <Demographics />}
        {tab === 'appfront'     && <Appfront startDate={startDate} endDate={endDate} />}
      </main>

      {/* Floating AI bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {aiOpen && (
          <div className="w-[370px] max-h-[600px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs">✦</div>
                <span className="text-sm font-semibold text-white">Ask AI</span>
                <span className="text-xs text-gray-500">· Gemini</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">×</button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AskAI meta={metaFiltered} ig={igFiltered} tiktok={tiktokFiltered} compact />
            </div>
          </div>
        )}
        {/* Trigger button */}
        <button
          onClick={() => setAiOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 shadow-xl shadow-purple-900/40 flex items-center justify-center text-2xl transition-all hover:scale-105 active:scale-95"
          title="Ask AI"
        >
          {aiOpen ? '×' : '✦'}
        </button>
      </div>
    </div>
    </PasswordGate>
  )
}
