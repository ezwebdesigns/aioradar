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

const HUES = ["#9b8af0", "#e8a0c8", "#8aa8e6", "#c8b47a", "#7ac8a8", "#c87a7a"]

function BarRow({label, value, width, tone="pink"}) {
  const colors = tone==="pink" ? "bg-[#e8a0c8]" : tone==="purple" ? "bg-[#9b8af0]" : "bg-[#8aa8e6]"
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="w-[72px] text-[12px] text-white/90 truncate">{label}</div>
      <div className="flex-1 flex gap-0.5">
        <div className="flex-1 h-3 rounded-full bg-white/15 overflow-hidden flex">
          <div className={`h-full rounded-full ${colors}`} style={{width: width}} />
          <div className="flex-1 flex gap-0.5 ml-0.5 opacity-30">
            {Array.from({length:18}).map((_,i)=><div key={i} className="w-0.5 h-3 bg-white/40 rounded-full" />)}
          </div>
        </div>
      </div>
      <div className="w-12 text-right text-white text-xs font-semibold">{value}</div>
    </div>
  )
}

const LINE_YOU = "M0 118 C 30 100, 55 140, 90 126 C 120 114, 145 106, 180 116 C 210 126, 235 100, 262 62 C 285 32, 302 36, 318 60 C 340 94, 375 104, 405 100 C 435 96, 465 80, 495 82 C 525 84, 555 96, 585 90 C 620 84, 665 76, 700 78"
const LINE_RIVAL = "M0 150 C 40 138, 90 156, 140 142 C 200 128, 240 100, 280 92 C 330 84, 380 94, 430 88 C 480 82, 540 74, 600 76 C 650 78, 690 74, 700 74"
const LINE_HUBS = "M0 170 C 40 160, 80 176, 120 168 C 160 160, 200 170, 240 162 C 280 154, 320 150, 360 148 C 400 146, 440 138, 480 140 C 520 142, 560 132, 600 134 C 640 136, 680 128, 700 128"

function ShareTrend({hasPrev}) {
  const tabs = ["Share","Mentions","Citations"]
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white flex flex-col">
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Share of voice trend</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Rolling 7-day trend · AIO mentions</p>
        </div>
        <div className="flex gap-1 bg-gray-50 rounded-full p-1 border border-gray-100">
          {tabs.map((t,i)=>(
            <button key={t} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition ${i===0 ? "bg-black text-white" : "text-gray-400 hover:text-gray-600"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#e8a0c8]"/> Your brand</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#9b8af0]"/> RivalCRM</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8aa8e6]"/> HubSpot</span>
      </div>

      <div className="relative flex-1 mt-3">
        <div className="flex">
          <div className="flex flex-col justify-between h-[190px] pr-2 text-[10px] text-gray-300 items-end">
            {["40%","30%","20%","10%","0%"].map(v=><span key={v}>{v}</span>)}
          </div>
          <div className="relative flex-1">
            {!hasPrev ? (
              <div className="h-[190px] flex items-center justify-center text-xs text-gray-300 text-center px-6">
                Single day of data — the trend lines appear as daily collects accumulate.
              </div>
            ) : (
<>
            <div className="absolute z-10 -top-1" style={{left:"40%", transform:"translate(-50%,0)"}}>
              <div className="bg-black text-white text-[11px] font-medium rounded-full px-3 py-1 whitespace-nowrap">32%</div>
            </div>
            <svg viewBox="0 0 700 200" preserveAspectRatio="none" className="block h-[190px] w-full">
              <defs>
                <linearGradient id="youArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d8a0c8" stopOpacity="0.30"/>
                  <stop offset="100%" stopColor="#d8a0c8" stopOpacity="0"/>
                </linearGradient>
                <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#c9a0d8" opacity="0.25"/>
                </pattern>
              </defs>
              {[10,55,100,145,190].map(y=><line key={y} x1="0" x2="700" y1={y} y2={y} stroke="#f1f0ef" strokeWidth="1"/>)}
              <path d={`${LINE_YOU} L700 200 L0 200 Z`} fill="url(#youArea)"/>
              <path d={`${LINE_YOU} L700 200 L0 200 Z`} fill="url(#dots)"/>
              <path d={LINE_HUBS} fill="none" stroke="#8aa8e6" strokeWidth="2" strokeLinecap="round"/>
              <path d={LINE_RIVAL} fill="none" stroke="#9b8af0" strokeWidth="2" strokeLinecap="round"/>
              <path d={LINE_YOU} fill="none" stroke="#d878b8" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="280" cy="92" r="5" fill="white" stroke="#9b8af0" strokeWidth="2.5"/>
            </svg>
</>
            )}
          </div>
        </div>
        <div className="flex justify-between pl-10 pt-3 text-[10px] text-gray-300">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d}>{d}</span>)}
        </div>
      </div>
    </div>
  )
}

function VoiceCard({rows}) {
  const bars = rows.slice(0, 6).map((r, i) => ({
    label: r.name,
    value: r.share + "%",
    width: Math.max(4, r.share) + "%",
    tone: ["purple","pink","blue","purple","pink","blue"][i % 6],
  }))
  return (
    <div className="bg-[#191919] rounded-[24px] p-5 shadow-sm flex flex-col text-white">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-[15px] font-semibold">Share of voice</h3>
          <p className="text-[11px] text-white/50 mt-0.5">AI Overview mentions, last 30 days</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
          <Icon path={<path d="M7 17L17 7M9 7h8v8"/>} size={14}/>
        </button>
      </div>
      <div className="flex flex-col gap-3 mt-6 flex-1 justify-center">
        {bars.length===0 && <div className="text-xs text-white/50 text-center py-6">No citations captured yet.</div>}
        {bars.map(v=><BarRow key={v.label} label={v.label} value={v.value} width={v.width} tone={v.tone}/>)}
      </div>
    </div>
  )
}

function MovePill({move}) {
  if (move==="gained") return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#1a7a2e]">Gaining</span>
  if (move==="lost") return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FDECEA] text-[#a33]">Losing</span>
  return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">Stable</span>
}

function CompetitorsTable({rows}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Tracked competitors</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Six competitors monitored across your tracked queries</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Export</button>
          <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Add competitor</button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="grid grid-cols-[1.8fr_0.8fr_0.9fr_0.9fr_0.9fr_0.9fr_40px] gap-4 px-2 py-3 border-b border-gray-100 text-[11px] text-gray-400 min-w-[760px]">
          <span>Competitor</span><span>Share</span><span>Citations</span><span>Mentions</span><span>First seen</span><span>30-day</span><span/>
        </div>
        {rows.length===0 && (
          <div className="py-10 text-center text-xs text-gray-400">No competitor citations tracked yet.</div>
        )}
        {rows.map((c,i)=>(
          <div key={c.name} className="grid grid-cols-[1.8fr_0.8fr_0.9fr_0.9fr_0.9fr_0.9fr_40px] gap-4 px-2 py-3.5 items-center text-sm hover:bg-gray-50/60 rounded-2xl min-w-[760px]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0" style={{backgroundColor: HUES[i % HUES.length]}}>{c.name[0]}</span>
              <span className="font-medium text-gray-900 truncate">{c.name}{!c.competitor && <span className="ml-2 text-[10px] font-medium text-[#c2508a] bg-[#FDECF5] px-2 py-0.5 rounded-full">You</span>}</span>
            </div>
            <span className="text-[13px] text-gray-700 font-medium">{c.share}%</span>
            <span className="text-[13px] text-gray-500">{c.citations}</span>
            <span className="text-[13px] text-gray-500">{c.mentions}</span>
            <span className="text-[13px] text-gray-400">{c.first}</span>
            <MovePill move={c.move}/>
            <button className="justify-self-end w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">⋮</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CompetitorsPage() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetch("/api/competitors")
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(setData)
      .catch(e => setErr(String(e)))
  }, [])

  const rows = data?.rows ?? []

  return (
    <Shell crumb={["Dashboard","Competitors"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Competitors</h1>
            <p className="text-xs text-gray-400 mt-1">Who takes your place inside AI Overviews, and where the visibility is shifting. {data && `${data.totalCitations} citations across ${data.snapshotCount} checks (latest ${data.day ?? "—"}).`}{err && <span className="text-[#a33]"> (API {err})</span>}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Export</button>
            <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Add competitor</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 mt-4">
        <ShareTrend hasPrev={data?.hasPrev}/>
        <VoiceCard rows={rows.slice(0, 6)}/>
      </div>

      <div className="mt-4">
        <CompetitorsTable rows={rows.filter(r=>r.competitor)}/>
      </div>
    </Shell>
  )
}
