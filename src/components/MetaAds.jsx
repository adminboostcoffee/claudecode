import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n?.toLocaleString() ?? '–'
}
function fmtMoney(n) { return '$' + (n || 0).toFixed(2) }
function fmtPct(n) { return ((n || 0) * 100).toFixed(2) + '%' }

function sumField(arr, f) { return arr.reduce((s, r) => s + (r[f] || 0), 0) }
function avgField(arr, f) { return arr.length ? sumField(arr, f) / arr.length : 0 }

function groupBy(arr, key) {
  return arr.reduce((acc, r) => {
    const k = r[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(r)
    return acc
  }, {})
}

function aggregateRows(rows) {
  const impressions = sumField(rows, 'impressions')
  const spend       = sumField(rows, 'spend')
  const clicks      = sumField(rows, 'clicks')
  const reach       = sumField(rows, 'reach')
  const cpm         = impressions > 0 ? (spend / impressions) * 1000 : 0
  const ctr         = impressions > 0 ? clicks / impressions : 0
  return { impressions, spend, clicks, reach, cpm, ctr }
}

const COL_HEADERS = ['Impressions', 'Reach', 'Spend', 'Clicks', 'CPM', 'CTR']

function MetricRow({ label, data, level, onExpand, expanded, sortMetric, children }) {
  const indent = level * 20
  const hi = 'text-orange-400'
  const normal = 'text-gray-100'
  const c = (col) => sortMetric === col ? hi : normal
  return (
    <>
      <tr
        className={`border-b border-gray-800 hover:bg-gray-800/40 cursor-pointer transition-colors ${level === 0 ? 'bg-gray-900' : level === 1 ? 'bg-gray-900/60' : 'bg-gray-950/60'}`}
        onClick={onExpand}
      >
        <td className="py-2.5 px-3" style={{ paddingLeft: 12 + indent }}>
          <div className="flex items-center gap-2">
            {onExpand && (
              <span className="text-gray-500 text-xs w-3">{expanded ? '▼' : '▶'}</span>
            )}
            {!onExpand && <span className="w-3" />}
            <span className={`text-sm ${level === 0 ? 'font-semibold text-white' : level === 1 ? 'text-gray-200' : 'text-gray-300'}`}>{label}</span>
          </div>
        </td>
        <td className={`py-2.5 px-3 text-sm text-right ${c('impressions')}`}>{fmt(data.impressions)}</td>
        <td className={`py-2.5 px-3 text-sm text-right ${c('reach')}`}>{fmt(data.reach)}</td>
        <td className={`py-2.5 px-3 text-sm text-right ${c('spend')}`}>${(data.spend || 0).toFixed(2)}</td>
        <td className={`py-2.5 px-3 text-sm text-right ${c('clicks')}`}>{fmt(data.clicks)}</td>
        <td className={`py-2.5 px-3 text-sm text-right ${c('cpm')}`}>${(data.cpm || 0).toFixed(2)}</td>
        <td className={`py-2.5 px-3 text-sm text-right ${c('ctr')}`}>{((data.ctr || 0) * 100).toFixed(2)}%</td>
      </tr>
      {expanded && children}
    </>
  )
}

export default function MetaAds({ data }) {
  const [expandedCampaigns, setExpandedCampaigns] = useState({})
  const [expandedAdsets, setExpandedAdsets] = useState({})
  const [sortMetric, setSortMetric] = useState('spend')
  const [sortAsc, setSortAsc] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredData = useMemo(() => {
    if (statusFilter === 'live')     return data.filter(r => r.status === 'ACTIVE')
    if (statusFilter === 'inactive') return data.filter(r => r.status === 'PAUSED')
    return data
  }, [data, statusFilter])

  const campaigns = useMemo(() => {
    const byCampaign = groupBy(filteredData, 'campaign')
    return Object.entries(byCampaign).map(([name, rows]) => {
      const byAdset = groupBy(rows, 'adset_name')
      const adsets = Object.entries(byAdset).map(([aName, aRows]) => {
        const byAd = groupBy(aRows, 'ad_name')
        const ads = Object.entries(byAd).map(([adName, adRows]) => ({
          name: adName, ...aggregateRows(adRows), rows: adRows,
        }))
        return { name: aName, ...aggregateRows(aRows), ads }
      })
      return { name, ...aggregateRows(rows), adsets }
    }).sort((a, b) => {
      if (sortMetric === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      return sortAsc ? a[sortMetric] - b[sortMetric] : b[sortMetric] - a[sortMetric]
    })
  }, [filteredData, sortMetric, sortAsc])

  // Daily trend
  const dailyData = useMemo(() => {
    const byDate = {}
    filteredData.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date.slice(5), impressions: 0, spend: 0 }
      byDate[r.date].impressions += r.impressions
      byDate[r.date].spend += r.spend
    })
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  const toggleCampaign = name => setExpandedCampaigns(p => ({ ...p, [name]: !p[name] }))
  const toggleAdset    = key  => setExpandedAdsets(p => ({ ...p, [key]: !p[key] }))

  const totals = aggregateRows(filteredData)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Total Impressions</div>
          <div className="text-2xl font-bold text-blue-400">{fmt(totals.impressions)}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Total Reach</div>
          <div className="text-2xl font-bold text-blue-400">{fmt(totals.reach)}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Total Spend</div>
          <div className="text-2xl font-bold text-orange-400">${totals.spend.toFixed(2)}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Avg. CPM</div>
          <div className="text-2xl font-bold text-blue-400">${totals.cpm.toFixed(2)}</div>
        </div>
      </div>

      {/* Daily trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Daily Impressions & Spend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v.toFixed(0)} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} />
            <Line yAxisId="left"  type="monotone" dataKey="impressions" stroke="#1877F2" dot={false} name="Impressions" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="spend"       stroke="#f97316" dot={false} name="Spend ($)"   strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign drilldown table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="font-semibold text-sm">Campaigns → Ad Sets → Ads</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              Sort by:
              {['impressions', 'spend', 'reach', 'clicks', 'name'].map(m => (
                <button
                  key={m}
                  onClick={() => setSortMetric(m)}
                  className={`px-2 py-0.5 rounded capitalize ${sortMetric === m ? 'bg-orange-500 text-white' : 'hover:text-gray-200'}`}
                >
                  {m === 'name' ? 'A–Z' : m}
                </button>
              ))}
              <button
                onClick={() => setSortAsc(a => !a)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                title={sortAsc ? 'Ascending' : 'Descending'}
              >
                <span className="text-[10px] leading-none">{sortAsc ? '↑' : '↓'}</span>
                <span>{sortAsc ? 'Asc' : 'Desc'}</span>
              </button>
            </div>
            <div className="flex items-center bg-gray-800 rounded-lg p-0.5 text-xs font-medium">
              {[
                { id: 'all',      label: 'All' },
                { id: 'live',     label: '🟢 Live' },
                { id: 'inactive', label: 'Inactive' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    statusFilter === f.id
                      ? f.id === 'live'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase">
                <th className="py-2 px-3 text-left">Name</th>
                {[['impressions','Impressions'],['reach','Reach'],['spend','Spend'],['clicks','Clicks'],['cpm','CPM'],['ctr','CTR']].map(([key, label]) => (
                  <th key={key} className={`py-2 px-3 text-right ${sortMetric === key ? 'text-orange-400' : ''}`}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <>
                  <MetricRow
                    key={c.name}
                    label={c.name}
                    data={c}
                    level={0}
                    expanded={expandedCampaigns[c.name]}
                    onExpand={() => toggleCampaign(c.name)}
                    sortMetric={sortMetric}
                  >
                    {c.adsets.map(a => {
                      const aKey = `${c.name}|${a.name}`
                      return (
                        <MetricRow
                          key={aKey}
                          label={a.name}
                          data={a}
                          level={1}
                          expanded={expandedAdsets[aKey]}
                          onExpand={() => toggleAdset(aKey)}
                          sortMetric={sortMetric}
                        >
                          {a.ads.map(ad => (
                            <MetricRow
                              key={ad.name}
                              label={ad.name}
                              data={ad}
                              level={2}
                              onExpand={null}
                              sortMetric={sortMetric}
                            />
                          ))}
                        </MetricRow>
                      )
                    })}
                  </MetricRow>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
