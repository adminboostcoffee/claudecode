export default function KpiCard({ label, value, sub, color = 'orange', icon }) {
  const colorMap = {
    orange: 'text-orange-400',
    blue:   'text-blue-400',
    pink:   'text-pink-400',
    teal:   'text-teal-400',
    purple: 'text-purple-400',
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
        {icon && <span className={`text-lg ${colorMap[color]}`}>{icon}</span>}
      </div>
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}
