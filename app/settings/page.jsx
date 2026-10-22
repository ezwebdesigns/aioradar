"use client"

import Shell from "../../components/Shell"
import { useState, useEffect } from "react"

function Icon({path, className="", size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  )
}

function Row({label, value}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100/80 last:border-0">
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className="text-[13px] font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}

function UsageBar({label, used, total, color="bg-[#e8a0c8]"}) {
  const pct = Math.round(used/total*100)
  return (
    <div className="py-3">
      <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
        <span>{label}</span>
        <span className="font-medium text-gray-900">{used} / {total}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} ${pct>=90 ? "" : ""}`} style={{width:`${pct}%`}}/>
      </div>
    </div>
  )
}

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("") || "··"
}

function ProfileCard() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch("/api/auth/get-session")
      .then(r => (r.ok ? r.json() : null))
      .then(j => setUser(j?.user ?? null))
      .catch(() => {})
  }, [])
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-semibold text-gray-900">Profile</h3>
        <button className="w-fit text-[11px] font-medium px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100 transition">Edit</button>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <span className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-400 flex items-center justify-center text-white text-sm font-semibold border border-white shadow-sm">{initials(user?.name)}</span>
        <div>
          <div className="text-sm font-semibold text-gray-900">{user?.name ?? "—"}</div>
          <div className="text-xs text-gray-400">{user?.email ?? "—"}</div>
        </div>
      </div>
      <div className="mt-3">
        <Row label="Timezone" value="Europe/Paris (UTC+2)"/>
        <Row label="Language" value="English"/>
      </div>
    </div>
  )
}

function WorkspaceCard() {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-semibold text-gray-900">Measurement defaults</h3>
        <button className="w-fit text-[11px] font-medium px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100 transition">Edit</button>
      </div>
      <p className="text-[11px] text-gray-400 mt-1">Applied to every new query added.</p>
      <div className="mt-3">
        <Row label="Country" value="United States"/>
        <Row label="Language" value="English"/>
        <Row label="Device" value="Desktop & Mobile"/>
        <Row label="Check frequency" value="Daily, 6:00am UTC"/>
      </div>
    </div>
  )
}

function ApiCard() {
  const [mode, setMode] = useState(null)
  useEffect(() => {
    fetch("/api/collect")
      .then(r => (r.ok ? r.json() : null))
      .then(j => setMode(j?.storeMode ?? null))
      .catch(() => {})
  }, [])
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-semibold text-gray-900">API & integrations</h3>
        <span className={`w-fit text-[11px] font-medium px-2.5 py-1 rounded-full ${mode === "neon" ? "bg-[#E6F4EA] text-[#1a7a2e]" : "bg-gray-100 text-gray-400"}`}>{mode === "neon" ? "Connected" : mode === null ? "..." : "Fallback"}</span>
      </div>
      <div className="mt-4 bg-gray-50/80 rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-400">HasData API key</div>
          <div className="text-[13px] font-mono text-gray-900 mt-0.5">hd_c••••••••••••••••••••••72b</div>
        </div>
        <button className="rounded-full bg-white border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition">Replace</button>
      </div>
      <p className="text-[10px] text-gray-400 mt-2">66 API credits left this month · 1 call per query per day (9 tracked queries)</p>
      <div className="mt-2">
        <Row label="Database" value={mode === "neon" ? "Neon Postgres" : mode === null ? "..." : "Local JSON fallback"}/>
        <Row label="Slack workspace" value="Not connected"/>
      </div>
    </div>
  )
}

function PlanCard() {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-semibold text-gray-900">Plan & usage</h3>
        <button className="rounded-full bg-black text-white px-3 py-1.5 text-[11px] font-medium hover:bg-gray-800 transition">Upgrade</button>
      </div>
      <div className="mt-3">
        <Row label="Current plan" value="Growth — $99/mo"/>
        <Row label="Renewal" value="Apr 1, 2026"/>
      </div>
      <UsageBar label="Queries tracked" used={9} total={500}/>
      <UsageBar label="Competitors" used={6} total={20} color="bg-[#9b8af0]"/>
      <UsageBar label="Team seats" used={4} total={5} color="bg-[#8aa8e6]"/>
      <button className="mt-2 text-[11px] font-medium text-gray-400 hover:text-gray-600 transition self-start">View billing history →</button>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Shell crumb={["Dashboard","Settings"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Settings</h1>
            <p className="text-xs text-gray-400 mt-1">Workspace, data sources and subscription.</p>
          </div>
          <span className="rounded-full bg-gray-50 border border-gray-100 px-4 py-2 text-xs font-medium text-gray-500">Workspace: Yourbrand Inc.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <ProfileCard/>
        <WorkspaceCard/>
        <ApiCard/>
        <PlanCard/>
      </div>

      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#FDECEA] mt-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-[13px] font-semibold text-[#a33]">Danger zone</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Delete this workspace and all tracked data. This cannot be undone.</p>
        </div>
        <button className="rounded-full border border-[#FDECEA] bg-[#FDECEA]/40 px-4 py-2 text-xs font-medium text-[#a33] hover:bg-[#FDECEA]/70 transition">Delete workspace</button>
      </div>
    </Shell>
  )
}
