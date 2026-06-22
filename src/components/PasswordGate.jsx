import { useState } from 'react'

const KEY = 'boost_dash_auth'
const HASH = btoa('fcH6G8Z4K$4N')

export function isAuthenticated() {
  return localStorage.getItem(KEY) === HASH
}

export default function PasswordGate({ children }) {
  const [authed, setAuthed]   = useState(isAuthenticated)
  const [input, setInput]     = useState('')
  const [error, setError]     = useState(false)
  const [shake, setShake]     = useState(false)

  if (authed) return children

  const submit = (e) => {
    e.preventDefault()
    if (btoa(input) === HASH) {
      localStorage.setItem(KEY, HASH)
      setAuthed(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className={`w-full max-w-sm transition-all relative z-10 ${shake ? 'animate-shake' : ''}`}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 select-none">
          <div className="flex items-center gap-0" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3rem', lineHeight: 1, fontWeight: 900 }}>
            <span style={{ color: '#F5A623', fontSize: '2.4rem', position: 'relative', top: '1px' }}>⚡</span>
            <span style={{ color: '#1EC8C8', letterSpacing: '-0.02em' }}>BOOST</span>
          </div>
          <div style={{ color: '#F5A623', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.22em', fontFamily: "'Montserrat', sans-serif" }}>
            COFFEE + ENERGY
          </div>
          <div className="w-8 h-px bg-gray-700 mt-4" />
          <p className="text-xs text-gray-500 mt-3 tracking-wide">Performance Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your access password to continue.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <input
                type="password"
                value={input}
                onChange={e => { setInput(e.target.value); setError(false) }}
                placeholder="Password"
                autoFocus
                className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors ${
                  error ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-teal-500'
                }`}
              />
              {error && <p className="text-xs text-red-400 mt-1.5">Incorrect password. Please try again.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-gray-900 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              Access Dashboard
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Boost Coffee & Energy · Internal Use Only
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20% { transform: translateX(-8px) }
          40% { transform: translateX(8px) }
          60% { transform: translateX(-5px) }
          80% { transform: translateX(5px) }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  )
}
