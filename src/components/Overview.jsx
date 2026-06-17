import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import KpiCard from './KpiCard'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n?.toLocaleString() ?? '–'
}
function fmtMoney(n) { return '$' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

function sumField(arr, field) { return arr.reduce((s, r) => s + (r[field] || 0), 0) }

const CHART_COLORS = { meta: '#1877F2', ig: '#E1306C', tiktok: '#69C9D0' }

export default function Overview({ meta, ig, tiktok }) {
  const metaImpressions = sumField(meta, 'impressions')
  const metaSpend       = sumField(meta, 'spend')
  const metaReach       = sumField(meta, 'reach')
  const metaClicks      = sumField(meta, 'clicks')

  const igViews         = sumField(ig, 'views')
  const igReach         = sumField(ig, 'reach')
  const igFollowers     = sumField(ig, 'new_followers')
  const igInteractions  = sumField(ig, 'interactions')

  const ttImpressions   = sumField(tiktok, 'impressions')
  const ttSpend         = sumField(tiktok, 'spend')
  const ttReach         = sumField(tiktok, 'reach')
  const ttVideoPlays    = sumField(tiktok, 'video_play_actions')

  const totalSpend      = metaSpend + ttSpend
  const totalImpressions = metaImpressions + igViews + ttImpressions
  const totalReach      = metaReach + igReach + ttReach
  const totalFollowers  = igFollowers

  // Build daily chart data merging all platforms by date
  const dateMap = {}
  meta.forEach(r => {
    if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, meta: 0, ig: 0, tiktok: 0 }
    dateMap[r.date].meta += r.impressions
  })
  ig.forEach(r => {
    if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, meta: 0, ig: 0, tiktok: 0 }
    dateMap[r.date].ig += r.views
  })
  tiktok.forEach(r => {
    if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, meta: 0, ig: 0, tiktok: 0 }
    dateMap[r.date].tiktok += r.impressions
  })
  const chartData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date)).map(d => ({
    ...d,
    label: d.date.slice(5),
  }))

  // Platform breakdown for bar chart
  const platformData = [
    { platform: 'Meta Ads', impressions: metaImpressions, spend: metaSpend, reach: metaReach },
    { platform: 'IG Organic', impressions: igViews, spend: 0, reach: igReach },
    { platform: 'TikTok Ads', impressions: ttImpressions, spend: ttSpend, reach: ttReach },
  ]

  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Impressions" value={fmt(totalImpressions)} sub="All platforms" color="orange" />
        <KpiCard label="Total Reach" value={fmt(totalReach)} sub="Unique accounts" color="blue" />
        <KpiCard label="Paid Ad Spend" value={fmtMoney(totalSpend)} sub="Meta + TikTok" color="pink" />
        <KpiCard label="New IG Followers" value={fmt(totalFollowers)} sub="Last 30 days" color="teal" />
      </div>

      {/* Per-platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="font-semibold text-sm">Meta Ads</span>
            <span className="ml-auto text-xs text-gray-400">Paid</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs text-gray-400">Impressions</div><div className="font-bold text-blue-400">{fmt(metaImpressions)}</div></div>
            <div><div className="text-xs text-gray-400">Reach</div><div className="font-bold text-blue-400">{fmt(metaReach)}</div></div>
            <div><div className="text-xs text-gray-400">Spend</div><div className="font-bold text-blue-400">{fmtMoney(metaSpend)}</div></div>
            <div><div className="text-xs text-gray-400">Clicks</div><div className="font-bold text-blue-400">{fmt(metaClicks)}</div></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="font-semibold text-sm">Instagram Organic</span>
            <span className="ml-auto text-xs text-gray-400">Organic</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs text-gray-400">Views</div><div className="font-bold text-pink-400">{fmt(igViews)}</div></div>
            <div><div className="text-xs text-gray-400">Reach</div><div className="font-bold text-pink-400">{fmt(igReach)}</div></div>
            <div><div className="text-xs text-gray-400">New Followers</div><div className="font-bold text-pink-400">{fmt(igFollowers)}</div></div>
            <div><div className="text-xs text-gray-400">Interactions</div><div className="font-bold text-pink-400">{fmt(igInteractions)}</div></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <span className="font-semibold text-sm">TikTok Ads</span>
            <span className="ml-auto text-xs text-gray-400">Paid</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs text-gray-400">Impressions</div><div className="font-bold text-teal-400">{fmt(ttImpressions)}</div></div>
            <div><div className="text-xs text-gray-400">Reach</div><div className="font-bold text-teal-400">{fmt(ttReach)}</div></div>
            <div><div className="text-xs text-gray-400">Spend</div><div className="font-bold text-teal-400">{fmtMoney(ttSpend)}</div></div>
            <div><div className="text-xs text-gray-400">Video Plays</div><div className="font-bold text-teal-400">{fmt(ttVideoPlays)}</div></div>
          </div>
        </div>
      </div>

      {/* Impressions over time */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Impressions / Views by Platform – Daily</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              formatter={(v, n) => [fmt(v), n]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="meta"   stackId="1" stroke={CHART_COLORS.meta}   fill={CHART_COLORS.meta}   fillOpacity={0.3} name="Meta Ads" />
            <Area type="monotone" dataKey="ig"     stackId="1" stroke={CHART_COLORS.ig}     fill={CHART_COLORS.ig}     fillOpacity={0.3} name="IG Organic" />
            <Area type="monotone" dataKey="tiktok" stackId="1" stroke={CHART_COLORS.tiktok} fill={CHART_COLORS.tiktok} fillOpacity={0.3} name="TikTok Ads" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Platform comparison */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Platform Reach Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={platformData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              formatter={(v, n) => [fmt(v), n]}
            />
            <Bar dataKey="reach" name="Reach" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="impressions" name="Impressions" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
