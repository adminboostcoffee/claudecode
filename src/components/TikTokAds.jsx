import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import KpiCard from './KpiCard'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n?.toLocaleString() ?? '–'
}
function sumField(arr, f) { return arr.reduce((s, r) => s + (r[f] || 0), 0) }
function groupBy(arr, key) {
  return arr.reduce((acc, r) => {
    const k = r[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(r)
    return acc
  }, {})
}
function aggregateRows(rows) {
  const impressions      = sumField(rows, 'impressions')
  const spend            = sumField(rows, 'spend')
  const clicks           = sumField(rows, 'clicks')
  const reach            = sumField(rows, 'reach')
  const video_play_actions = sumField(rows, 'video_play_actions')
  const cpm              = impressions > 0 ? (spend / impressions) * 1000 : 0
  return { impressions, spend, clicks, reach, video_play_actions, cpm }
}

export default function TikTokAds({ data }) {
  const [expandedCampaigns, setExpandedCampaigns] = useState({})

  const totals = aggregateRows(data)

  const campaigns = useMemo(() => {
    const byCampaign = groupBy(data, 'campaign_name')
    return Object.entries(byCampaign).map(([name, rows]) => {
      const byAd = groupBy(rows, 'ad_name')
      const ads = Object.entries(byAd).map(([adName, adRows]) => ({
        name: adName, ...aggregateRows(adRows),
      }))
      return { name, ...aggregateRows(rows), ads }
    }).sort((a, b) => b.spend - a.spend)
  }, [data])

  const dailyData = useMemo(() => {
    const byDate = {}
    data.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date.slice(5), impressions: 0, spend: 0, video_plays: 0 }
      byDate[r.date].impressions  += r.impressions
      byDate[r.date].spend        += r.spend
      byDate[r.date].video_plays  += r.video_play_actions || 0
    })
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  const adChartData = useMemo(() => {
    const byAd = groupBy(data, 'ad_name')
    return Object.entries(byAd).map(([name, rows]) => ({
      name: name.length > 25 ? name.slice(0, 25) + '…' : name,
      impressions: sumField(rows, 'impressions'),
      spend: sumField(rows, 'spend'),
      video_plays: sumField(rows, 'video_play_actions'),
    })).sort((a, b) => b.impressions - a.impressions)
  }, [data])

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Impressions" value={fmt(totals.impressions)} color="teal" />
        <KpiCard label="Total Reach" value={fmt(totals.reach)} color="teal" />
        <KpiCard label="Total Spend" value={'$' + totals.spend.toFixed(2)} color="orange" />
        <KpiCard label="Video Plays" value={fmt(totals.video_play_actions)} color="teal" />
      </div>

      {/* Daily trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Daily Performance</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v.toFixed(0)} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line yAxisId="left"  type="monotone" dataKey="impressions"  stroke="#69C9D0" dot={false} name="Impressions"  strokeWidth={2} />
            <Line yAxisId="left"  type="monotone" dataKey="video_plays"  stroke="#a855f7" dot={false} name="Video Plays"  strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="spend"        stroke="#f97316" dot={false} name="Spend ($)"    strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Ad creative performance */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Creative Performance by Ad</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={adChartData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} width={160} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} formatter={v => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="impressions"  name="Impressions"  fill="#69C9D0" radius={[0, 3, 3, 0]} />
            <Bar dataKey="video_plays"  name="Video Plays"  fill="#a855f7" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign → Ad drilldown table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="font-semibold text-sm">Campaigns → Ads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase">
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-right">Impressions</th>
                <th className="py-2 px-3 text-right">Reach</th>
                <th className="py-2 px-3 text-right">Spend</th>
                <th className="py-2 px-3 text-right">Video Plays</th>
                <th className="py-2 px-3 text-right">CPM</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <>
                  <tr
                    key={c.name}
                    className="border-b border-gray-800 bg-gray-900 hover:bg-gray-800/40 cursor-pointer"
                    onClick={() => setExpandedCampaigns(p => ({ ...p, [c.name]: !p[c.name] }))}
                  >
                    <td className="py-2.5 px-3 font-semibold flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-3">{expandedCampaigns[c.name] ? '▼' : '▶'}</span>
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3 text-right">{fmt(c.impressions)}</td>
                    <td className="py-2.5 px-3 text-right">{fmt(c.reach)}</td>
                    <td className="py-2.5 px-3 text-right text-orange-400">${c.spend.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-purple-400">{fmt(c.video_play_actions)}</td>
                    <td className="py-2.5 px-3 text-right">${c.cpm.toFixed(2)}</td>
                  </tr>
                  {expandedCampaigns[c.name] && c.ads.map(ad => (
                    <tr key={ad.name} className="border-b border-gray-800 bg-gray-950/60 hover:bg-gray-800/20">
                      <td className="py-2 px-3 pl-10 text-gray-300 text-sm">{ad.name}</td>
                      <td className="py-2 px-3 text-right text-sm">{fmt(ad.impressions)}</td>
                      <td className="py-2 px-3 text-right text-sm">{fmt(ad.reach)}</td>
                      <td className="py-2 px-3 text-right text-sm text-orange-400">${ad.spend.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-sm text-purple-400">{fmt(ad.video_play_actions)}</td>
                      <td className="py-2 px-3 text-right text-sm">${ad.cpm.toFixed(2)}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
