"use client"

import { useState, useEffect } from "react"
import Shell from "../components/Shell"

function Icon({path, className="", size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  )
}

const SPARK_COLORS = { pink:"#d8a0c8", purple:"#9b8af0", blue:"#8aa8e6" }

function Sparkline({color="pink"}) {
  const c = SPARK_COLORS[color]
  return (
    <svg width="90" height="30" viewBox="0 0 90 30" className="opacity-80">
      <path d="M2 22 C10 20 18 24 28 14 C38 4 48 24 58 18 C68 12 78 16 86 8" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="86" cy="8" r="3" fill="white" stroke={c} strokeWidth="1.5"/>
    </svg>
  )
}

function StatCard({label, value, delta, isNew, color="green", spark="pink", icon, loading}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white flex flex-col gap-4 min-h-[122px]">
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">{icon}</div>
        <Sparkline color={spark}/>
      </div>
      <div>
        <div className="text-[12px] text-gray-500">{label}</div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[22px] font-semibold tracking-tight text-gray-900">{loading ? "\u2014" : value}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${isNew ? "bg-gray-100 text-gray-400" : color==="green" ? "bg-[#E6F4EA] text-[#1a7a2e]" : "bg-[#FDECEA] text-[#a33]"}`}>{isNew ? "First day" : delta}</span>
        </div>
      </div>
    </div>
  )
}

function BarRow({label, value, width, tone="pink"}) {
  const colors = tone==="pink" ? "bg-[#e8a0c8]" : tone==="purple" ? "bg-[#9b8af0]" : "bg-[#8aa8e6]"
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="w-[72px] text-[11px] text-white/90 truncate">{label}</div>
      <div className="flex-1 flex gap-0.5">
        <div className="flex-1 h-3 rounded-full bg-white/15 overflow-hidden flex">
          <div className={`h-full rounded-full ${colors}`} style={{width: width}} />
        </div>
      </div>
      <div className="w-12 text-right text-white text-xs font-semibold">{value}</div>
    </div>
  )
}

const CHART_PINK = "M0 118 C 30 100, 55 140, 90 126 C 120 114, 145 106, 180 116 C 210 126, 235 100, 262 62 C 285 32, 302 36, 318 60 C 340 94, 375 104, 405 100 C 435 96, 465 80, 495 82 C 525 84, 555 96, 585 90 C 620 84, 665 76, 700 78"
const CHART_BLUE = "M0 152 C 40 142, 80 158, 120 150 C 160 142, 200 152, 240 144 C 280 136, 320 132, 360 130 C 400 128, 440 120, 480 122 C 520 124, 560 114, 600 116 C 640 118, 680 110, 700 110"

function VisibilityTrend({coverage, total}) {
  const tabs = ["Coverage","Mentions","Citations","Competitors"]
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white flex flex-col">
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Visibility trend</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Rolling 7-day trend &middot; {total} queries</p>
        </div>
        <div className="flex gap-1 bg-gray-50 rounded-full p-1 border border-gray-100">
          {tabs.map((t,i)=>(
            <button key={t} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition ${i===0 ? "bg-black text-white" : "text-gray-400 hover:text-gray-600"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 mt-5">
        <div className="flex">
          <div className="flex flex-col justify-between h-[190px] pr-2 text-[10px] text-gray-300 items-end">
            {["80%","60%","40%","20%","0%"].map(v=><span key={v}>{v}</span>)}
          </div>
          <div className="relative flex-1">
            <div className="absolute z-10 -top-1" style={{left:"45.4%", transform:"translate(-50%,0)"}}>
              <div className="bg-black text-white text-[11px] font-medium rounded-full px-3 py-1 whitespace-nowrap">{coverage}%</div>
            </div>
            <svg viewBox="0 0 700 200" preserveAspectRatio="none" className="block h-[190px] w-full">
              <defs>
                <linearGradient id="areaPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d8a0c8" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#d8a0c8" stopOpacity="0"/>
                </linearGradient>
                <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#c9a0d8" opacity="0.25"/>
                </pattern>
              </defs>
              {[10,55,100,145,190].map(y=><line key={y} x1="0" x2="700" y1={y} y2={y} stroke="#f1f0ef" strokeWidth="1"/>)}
              <path d={`${CHART_PINK} L700 200 L0 200 Z`} fill="url(#areaPink)"/>
              <path d={`${CHART_PINK} L700 200 L0 200 Z`} fill="url(#dots)"/>
              <path d={CHART_BLUE} fill="none" stroke="#8aa8e6" strokeWidth="2" strokeLinecap="round"/>
              <path d={CHART_PINK} fill="none" stroke="#d878b8" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="318" cy="44" r="5" fill="white" stroke="#d878b8" strokeWidth="2.5"/>
            </svg>
          </div>
        </div>
        <div className="flex justify-between pl-10 pt-3 text-[10px] text-gray-300">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d}>{d}</span>)}
        </div>
      </div>
      <p className="text-[10px] text-gray-300 mt-2">Chart fills in as daily collects accumulate.</p>
    </div>
  )
}

function CompetitorShare({citations}) {
  const top = citations[0]?.pct || 100
  return (
    <div className="bg-[#191919] rounded-[24px] p-5 shadow-sm flex flex-col text-white">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-[15px] font-semibold">Citation share of voice</h3>
          <p className="text-[11px] text-white/50 mt-0.5">Domains cited in AI Overviews, latest check</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
          <Icon path={<path d="M7 17L17 7M9 7h8v8"/>} size={14}/>
        </button>
      </div>
      <div className="flex flex-col gap-3 mt-6 flex-1 justify-center">
        {citations.map((c, i)=><BarRow key={c.domain} label={c.domain} value={`${c.pct}%`} width={`${Math.max(8, Math.round((c.pct/top)*100))}%`} tone={"pink,purple,blue".split(",")[i%3]}/>)}
        {citations.length===0 && <p className="text-[11px] text-white/40">No AI Overview citations on the latest check.</p>}
      </div>
    </div>
  )
}

function AioPill({state}) {
  return state==="yes"
    ? <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#1a7a2e]">Yes</span>
    : <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">No</span>
}

function Check({ok}) {
  return ok
    ? <span className="text-[#1a7a2e] text-sm">&#10003;</span>
    : <span className="text-[#a33] text-sm">&#10007;</span>
}

function RecentChanges({snapshots}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Latest check</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Per-query visibility state from the most recent collect</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">View all alerts</button>
          <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
            <Icon path={<path d="M7 17L17 7M9 7h8v8"/>} size={14}/>
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="grid grid-cols-[2.2fr_0.9fr_0.8fr_1.1fr_1fr_0.7fr] gap-4 px-2 py-3 border-b border-gray-100 text-[11px] text-gray-400 min-w-[860px]">
          <span>Query</span><span>AI Overview</span><span>Mention</span><span>Your citation</span><span>Top source</span><span>Position</span>
        </div>
        {snapshots.map(s=>(
          <div key={s.id} className="grid grid-cols-[2.2fr_0.9fr_0.8fr_1.1fr_1fr_0.7fr] gap-4 px-2 py-3.5 items-center text-sm hover:bg-gray-50/60 rounded-2xl min-w-[860px]">
            <span className="font-medium text-gray-900 truncate">{s.keyword}</span>
            <AioPill state={s.hasAio ? "yes" : "no"}/>
            {s.hasAio
              ? <Check ok={s.mentionsBrand}/>
              : <span className="text-gray-300 text-xs">&mdash;</span>}
            <span className="text-gray-500 text-[13px] truncate">{s.brandCited ? "yourbrand.com cited" : (s.hasAio ? "Not cited" : "\u2014")}</span>
            <span className="text-gray-500 text-[13px] truncate">{s.topDomain ?? "\u2014"}</span>
            <span className="text-gray-500 text-[13px]">{s.ourOrganicPosition ?? "\u2014"}</span>
          </div>
        ))}
        {snapshots.length===0 && (
          <div className="py-10 text-center text-xs text-gray-400">No collection data yet.</div>
        )}
      </div>
    </div>
  )
}

export default function Page(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch("/api/collect").then((r) => r.json()).then((res) => {
      if (!alive) return
      setData(res)
      setLoading(false)
    }).catch(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  const metrics = data?.metrics
  const newest = {}
  const latestDay = metrics?.day
  const latestSnapshots = (data?.snapshots ?? []).filter((s) => s.day === latestDay && !s.error)

  const isNew = metrics ? !metrics.hasPrev : true

  return (
    <Shell crumb={["Dashboard","Overview"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Welcome back!</h1>
            <p className="text-xs text-gray-400 mt-1">
              How visible your brand is inside Google AI Overviews
              {metrics ? `, across ${metrics.coverage.total} tracked queries.` : "."}
              {data && <span className="ml-2 text-[11px] text-gray-300">{`Latest collect: ${metrics?.day ?? "\u2014"} (${data.mode})`}</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Export report</button>
            <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Run daily check</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <StatCard loading={loading} label="AI Overview Coverage" value={`${metrics?.coverage.value ?? 0}%`} isNew={isNew} delta={"+5.2%"} icon={<Icon path={<path d="M13 3L4 14h6l-1 7 9-11h-6z"/>} size={14}/>}/>
          <StatCard loading={loading} label="Brand Mention Rate" value={`${metrics?.mentionRate.value ?? 0}%`} isNew={isNew} delta={"+3.1%"} spark="purple" icon={<Icon path={<><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></>} size={14}/>}/>
          <StatCard loading={loading} label="Citation Share" value={`${metrics?.citationShare.value ?? 0}%`} isNew={isNew} delta={"\u22121.8%"} color="red" spark="blue" icon={<Icon path={<><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.5-1.5"/></>} size={14}/>}/>
          <StatCard loading={loading} label="7-Day Volatility" value={metrics?.volatility ?? 0} isNew={isNew} delta={"+6"} color="red" spark="pink" icon={<Icon path={<><path d="M3 12h4l3-8 4 16 3-8h4"/></>} size={14}/>}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 mt-4">
        <VisibilityTrend coverage={metrics?.coverage.value ?? 0} total={metrics?.coverage.total ?? 0}/>
        <CompetitorShare citations={metrics?.citations ?? []}/>
      </div>

      <div className="mt-4">
        <RecentChanges snapshots={loading ? [] : latestSnapshots}/>
      </div>
    </Shell>
  )
}
