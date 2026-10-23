"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
const signUp = async () => {}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Could not create account")
        setBusy(false)
        return
      }
      router.push("/")
    } catch (err) {
      setError("Unexpected error")
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF9F4] via-[#F7F3FB] to-[#EEF3FA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-300 flex items-center justify-center text-white">◈</div>
          <span className="font-semibold text-gray-900 text-lg">AIO Radar</span>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white">
          <h1 className="text-[18px] font-semibold text-gray-900">Create your account</h1>
          <p className="text-xs text-gray-400 mt-1 mb-5">Start tracking your AI Overview visibility today.</p>
          <form onSubmit={submit} action="/api/auth/signup" className="flex flex-col gap-3">
            <input
              type="text" required placeholder="Your name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-full px-4 py-2.5 text-sm border border-gray-200 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 bg-[#FDF9F4] placeholder:text-gray-400"
            />
            <input
              type="email" required placeholder="you@company.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full px-4 py-2.5 text-sm border border-gray-200 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 bg-[#FDF9F4] placeholder:text-gray-400"
            />
            <input
              type="password" required placeholder="Password (8+ chars)" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full px-4 py-2.5 text-sm border border-gray-200 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 bg-[#FDF9F4] placeholder:text-gray-400"
            />
            {error && <div className="text-[11px] text-[#a33] bg-[#FDECEA] rounded-full px-3 py-1.5">{error}</div>}
            <button
              type="submit" disabled={busy}
              className="rounded-full bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {busy ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Already have an account? <Link href="/login" className="text-gray-700 font-medium hover:text-gray-900">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
