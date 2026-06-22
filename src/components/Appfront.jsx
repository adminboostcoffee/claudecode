import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

// ─── Cloudflare Worker URL (update after deploying worker/index.js to Cloudflare) ───
const ENDPOINT = 'https://boost-appfront.aubrianna.workers.dev'

const GQL_QUERY = `
query analyticsBoxes(
  $orderFilter: OrderFilter, $membersOnly: Boolean,
  $groupIds: [ID!], $ninGroupIds: [ID!], $limit: Int,
  $seenPlatforms: [String], $registrationDate: [String],
  $preferredLocations: [String], $registeredOnChannel: [String],
  $lastSeenDate: [String], $search: String, $event: String,
  $channel: String, $redeemedCouponPolicyIds: [ID!],
  $notRedeemedCouponPolicyIds: [ID!], $receivedCouponPolicyIds: [ID!]
) {
  customerBoxes(
    search: $search event: $event channel: $channel
    membersOnly: $membersOnly orderFilter: $orderFilter
    groupIds: $groupIds ninGroupIds: $ninGroupIds
    redeemedCouponPolicyIds: $redeemedCouponPolicyIds
    notRedeemedCouponPolicyIds: $notRedeemedCouponPolicyIds
    receivedCouponPolicyIds: $receivedCouponPolicyIds
    limit: $limit seenPlatforms: $seenPlatforms
    registrationDate: $registrationDate
    preferredLocations: $preferredLocations
    registeredOnChannel: $registeredOnChannel
    lastSeenDate: $lastSeenDate
  ) {
    total
    purchaseTimeseries {
      date spentAmount netSpentAmount count branchesBreakdown
    }
    topItems
    topSpenders
    topVisitors
    topAvgSpenders
    topUpsales
    upsellTotals
    geoLocations
    visitsBreakdown
  }
}
`

function fmt$(n) { return '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return (n || 0).toLocaleString()
}
function initials(name) {
  return (name || '?').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

const PALETTE = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']

function KpiHero({ label, value, sub, accent = '#f97316' }) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-hidden group hover:border-gray-600 transition-colors">
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}, transparent 70%)` }} />
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function CustomerRow({ rank, name, email, primary, secondary, primaryLabel, secondaryLabel, color }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-800/60 last:border-0">
      <span className="text-xs text-gray-600 w-4 text-center">{rank}</span>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
        style={{ background: color }}>
        {initials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{name || 'Unknown'}</p>
        <p className="text-xs text-gray-500 truncate">{email || ''}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-orange-400">{primary}</p>
        <p className="text-xs text-gray-500">{secondaryLabel}: {secondary}</p>
      </div>
    </div>
  )
}

export default function Appfront({ startDate = '2026-06-01', endDate = '2026-06-22' }) {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [leaderTab, setLeaderTab] = useState('spenders')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: 'analyticsBoxes',
          variables: {
            orderFilter: {
              dateRange: {
                start: `${startDate}T04:00:00.000Z`,
                end:   `${endDate}T03:59:59.999Z`,
              }
            },
            membersOnly: true,
            limit: 5,
          },
          query: GQL_QUERY,
        }),
      })
      const json = await res.json()
      if (json.errors) throw new Error(json.errors[0].message)
      setData(json.data.customerBoxes)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => { fetchData() }, [startDate, endDate])

  const totals      = data?.total?.[0] || {}
  const sales       = totals.spentAmount   || 0
  const visits      = totals.visitCount    || 0
  const customers   = totals.userCount     || 0
  const avgTicket   = visits > 0   ? sales / visits    : 0
  const avgPerCust  = customers > 0 ? sales / customers : 0

  const coupons = (data?.purchaseTimeseries || []).reduce((sum, day) => {
    return sum + (day.branchesBreakdown || []).reduce((s, b) =>
      s + (Array.isArray(b.couponRedeemings) ? b.couponRedeemings.length : 0), 0)
  }, 0)

  const chartData = (data?.purchaseTimeseries || []).map(d => ({
    date:   d.date,
    sales:  parseFloat(d.spentAmount?.toFixed(2) || 0),
    orders: d.count || 0,
  }))

  const topItems = (data?.topItems || []).slice(0, 8)
  const maxItemCount = topItems[0]?.count || 1

  const leaderData = {
    spenders: data?.topSpenders || [],
    visitors: data?.topVisitors || [],
    avg:      data?.topAvgSpenders || [],
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-xl">☕</span> Appfront — App Performance
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Live loyalty & ordering data · Members only</p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-sm text-red-400">
          <strong>Connection error:</strong> {error}
          <p className="mt-1 text-xs text-red-500">The auth token may have expired. Copy a fresh one from Appfront's DevTools → Network → graphql → Headers → Authorization.</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-gray-800 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* KPI hero cards */}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <KpiHero label="Total Sales"       value={fmt$(sales)}       sub={`${visits} orders placed`}          accent="#f97316" />
            <KpiHero label="Total Visits"      value={visits.toLocaleString()} sub={`${customers} unique members`} accent="#3b82f6" />
            <KpiHero label="Avg Ticket"        value={fmt$(avgTicket)}   sub="per order"                          accent="#8b5cf6" />
            <KpiHero label="Avg per Customer"  value={fmt$(avgPerCust)}  sub="lifetime in period"                 accent="#10b981" />
            <KpiHero label="Coupons Redeemed"  value={coupons.toLocaleString()} sub="in date range"              accent="#ec4899" />
            <KpiHero label="Active Members"    value={customers.toLocaleString()} sub="placed at least 1 order"  accent="#f59e0b" />
          </div>

          {/* Daily sales area chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-semibold text-sm text-gray-200 mb-4">Daily Sales & Order Volume</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v.toFixed(0)} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, fontSize: 12 }}
                  formatter={(v, name) => [name === 'Sales' ? fmt$(v) : v, name]}
                />
                <Area yAxisId="left"  type="monotone" dataKey="sales"  name="Sales"  stroke="#f97316" strokeWidth={2} fill="url(#salesGrad)" dot={false} />
                <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2} fill="url(#ordersGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top items + Leaderboard side by side */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* Top items */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-semibold text-sm text-gray-200 mb-4">Top Menu Items</h3>
              <div className="space-y-3">
                {topItems.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-200 truncate">{item.name}</span>
                      <div className="text-right flex-shrink-0 ml-3">
                        <span className="text-sm font-semibold text-orange-400">{item.count}</span>
                        <span className="text-xs text-gray-500 ml-1.5">{fmt$(item.spentAmount)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(item.count / maxItemCount) * 100}%`,
                          background: PALETTE[i % PALETTE.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
                {topItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No item data for this range</p>
                )}
              </div>
            </div>

            {/* Customer leaderboard */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-200">Customer Leaderboard</h3>
                <div className="flex gap-1 text-xs">
                  {[
                    { id: 'spenders', label: 'Top Spend' },
                    { id: 'visitors', label: 'Most Visits' },
                    { id: 'avg',      label: 'Avg Order' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setLeaderTab(t.id)}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${leaderTab === t.id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {leaderTab === 'spenders' && leaderData.spenders.map((c, i) => (
                  <CustomerRow key={c._id} rank={i + 1} name={c.name} email={c.email}
                    primary={fmt$(c.spentAmount)} primaryLabel="Spent"
                    secondary={c.visitCount} secondaryLabel="visits"
                    color={PALETTE[i % PALETTE.length]}
                  />
                ))}
                {leaderTab === 'visitors' && leaderData.visitors.map((c, i) => (
                  <CustomerRow key={c._id} rank={i + 1} name={c.name} email={c.email}
                    primary={`${c.visitCount} visits`} primaryLabel="Visits"
                    secondary={fmt$(c.spentAmount)} secondaryLabel="spent"
                    color={PALETTE[i % PALETTE.length]}
                  />
                ))}
                {leaderTab === 'avg' && leaderData.avg.map((c, i) => (
                  <CustomerRow key={c._id} rank={i + 1} name={c.name} email={c.email}
                    primary={fmt$(c.avgSpentAmount)} primaryLabel="Avg"
                    secondary={c.visitCount} secondaryLabel="visits"
                    color={PALETTE[i % PALETTE.length]}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
