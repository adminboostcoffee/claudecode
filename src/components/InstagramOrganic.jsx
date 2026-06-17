import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import KpiCard from './KpiCard'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n?.toLocaleString() ?? '–'
}
function sumField(arr, f) { return arr.reduce((s, r) => s + (r[f] || 0), 0) }

export default function InstagramOrganic({ data }) {
  const totalViews        = sumField(data, 'views')
  const totalReach        = sumField(data, 'reach')
  const totalFollowers    = sumField(data, 'new_followers')
  const totalInteractions = sumField(data, 'interactions')
  const totalLikes        = sumField(data, 'likes')
  const totalComments     = sumField(data, 'comments')
  const totalShares       = sumField(data, 'shares')
  const totalSaves        = sumField(data, 'saves')

  const chartData = data.map(d => ({ ...d, label: d.date.slice(5) }))

  const engagementData = data.map(d => ({
    label: d.date.slice(5),
    likes: d.likes,
    comments: d.comments,
    shares: d.shares,
    saves: d.saves,
  }))

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Views" value={fmt(totalViews)} sub="Reels, posts, stories" color="pink" />
        <KpiCard label="Total Reach" value={fmt(totalReach)} sub="Unique accounts" color="pink" />
        <KpiCard label="New Followers" value={fmt(totalFollowers)} sub="Last 30 days" color="purple" />
        <KpiCard label="Total Interactions" value={fmt(totalInteractions)} sub="Likes + comments + shares + saves" color="pink" />
      </div>

      {/* Reach + Views over time */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Daily Reach & Views</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} formatter={v => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="views" stroke="#E1306C" fill="#E1306C" fillOpacity={0.2} name="Views" />
            <Area type="monotone" dataKey="reach" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} name="Reach" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* New followers over time */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">New Followers by Day</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="new_followers" name="New Followers" fill="#a855f7" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Engagement Breakdown (Likes / Comments / Shares / Saves)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="likes"    stackId="e" name="Likes"    fill="#E1306C" />
            <Bar dataKey="comments" stackId="e" name="Comments" fill="#f97316" />
            <Bar dataKey="shares"   stackId="e" name="Shares"   fill="#a855f7" />
            <Bar dataKey="saves"    stackId="e" name="Saves"    fill="#14b8a6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-pink-400">{fmt(totalLikes)}</div>
          <div className="text-xs text-gray-400 mt-1">Likes</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{fmt(totalComments)}</div>
          <div className="text-xs text-gray-400 mt-1">Comments</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{fmt(totalShares)}</div>
          <div className="text-xs text-gray-400 mt-1">Shares</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{fmt(totalSaves)}</div>
          <div className="text-xs text-gray-400 mt-1">Saves</div>
        </div>
      </div>
    </div>
  )
}
