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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className={`w-full max-w-sm transition-all ${shake ? 'animate-shake' : ''}`}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 select-none">
          <img
            src="/logo.png"
            alt="Boost Coffee + Energy"
            className="w-44 object-contain mb-3"
          />
          <p className="text-xs text-gray-500">Performance Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
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
                  error ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-orange-500'
                }`}
              />
              {error && <p className="text-xs text-red-400 mt-1.5">Incorrect password. Please try again.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
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
