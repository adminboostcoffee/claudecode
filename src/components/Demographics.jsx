import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts'
import { metaDemographics } from '../data/index'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n?.toLocaleString() ?? '–'
}

const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
const GENDER_COLORS = { female: '#E1306C', male: '#1877F2', unknown: '#6b7280' }
const PIE_COLORS = ['#E1306C', '#1877F2', '#6b7280']

export default function Demographics() {
  // Age breakdown (sum over genders, exclude unknown age)
  const ageData = AGE_GROUPS.map(age => {
    const rows = metaDemographics.filter(r => r.age === age)
    return {
      age,
      impressions: rows.reduce((s, r) => s + r.impressions, 0),
      spend:       rows.reduce((s, r) => s + r.spend, 0),
      reach:       rows.reduce((s, r) => s + r.reach, 0),
      clicks:      rows.reduce((s, r) => s + r.clicks, 0),
    }
  })

  // Gender breakdown
  const genderTotals = ['female', 'male', 'unknown'].map(g => {
    const rows = metaDemographics.filter(r => r.gender === g)
    return {
      gender: g.charAt(0).toUpperCase() + g.slice(1),
      impressions: rows.reduce((s, r) => s + r.impressions, 0),
      spend:       rows.reduce((s, r) => s + r.spend, 0),
      reach:       rows.reduce((s, r) => s + r.reach, 0),
      clicks:      rows.reduce((s, r) => s + r.clicks, 0),
    }
  })

  // Age × gender (stacked)
  const ageGenderData = AGE_GROUPS.map(age => {
    const entry = { age }
    ;['female', 'male', 'unknown'].forEach(g => {
      const row = metaDemographics.find(r => r.age === age && r.gender === g)
      entry[g] = row?.impressions || 0
    })
    return entry
  })

  const totalImpressions = metaDemographics.reduce((s, r) => s + r.impressions, 0)

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">Meta Ads demographic breakdown · Last 30 days · Paid campaigns only</p>

      {/* Gender summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-sm text-gray-200">Impressions by Gender</h3>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie
                data={genderTotals}
                dataKey="impressions"
                nameKey="gender"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
              >
                {genderTotals.map((entry, i) => (
                  <Cell key={entry.gender} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                formatter={v => fmt(v)}
              />
            </PieChart>
            <div className="flex flex-col gap-3">
              {genderTotals.map((g, i) => (
                <div key={g.gender} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }}></div>
                  <span className="text-sm text-gray-300">{g.gender}</span>
                  <span className="ml-auto text-sm font-semibold">{fmt(g.impressions)}</span>
                  <span className="text-xs text-gray-500">({((g.impressions / totalImpressions) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-sm text-gray-200">Spend & Reach by Gender</h3>
          <div className="space-y-3">
            {genderTotals.filter(g => g.gender !== 'Unknown').map((g, i) => (
              <div key={g.gender}>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{g.gender}</span>
                  <span className="font-semibold text-white">${g.spend.toFixed(0)} spent · {fmt(g.reach)} reach · {fmt(g.clicks)} clicks</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(g.impressions / totalImpressions * 100).toFixed(0)}%`, background: PIE_COLORS[i] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Impressions by Age Group</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ageData}>
            <XAxis dataKey="age" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} formatter={v => fmt(v)} />
            <Bar dataKey="impressions" name="Impressions" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Age × Gender stacked */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 text-sm text-gray-200">Impressions by Age × Gender</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ageGenderData}>
            <XAxis dataKey="age" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={v => fmt(v)} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} formatter={v => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="female"  stackId="g" name="Female"  fill="#E1306C" />
            <Bar dataKey="male"    stackId="g" name="Male"    fill="#1877F2" />
            <Bar dataKey="unknown" stackId="g" name="Unknown" fill="#6b7280" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Age data table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="font-semibold text-sm">Age Group Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase">
              <th className="py-2 px-4 text-left">Age Group</th>
              <th className="py-2 px-4 text-right">Impressions</th>
              <th className="py-2 px-4 text-right">Reach</th>
              <th className="py-2 px-4 text-right">Spend</th>
              <th className="py-2 px-4 text-right">Clicks</th>
              <th className="py-2 px-4 text-right">Share of Impr.</th>
            </tr>
          </thead>
          <tbody>
            {ageData.map(row => (
              <tr key={row.age} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="py-2.5 px-4 font-medium">{row.age}</td>
                <td className="py-2.5 px-4 text-right">{fmt(row.impressions)}</td>
                <td className="py-2.5 px-4 text-right">{fmt(row.reach)}</td>
                <td className="py-2.5 px-4 text-right text-orange-400">${row.spend.toFixed(0)}</td>
                <td className="py-2.5 px-4 text-right">{fmt(row.clicks)}</td>
                <td className="py-2.5 px-4 text-right text-gray-400">
                  {((row.impressions / totalImpressions) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
