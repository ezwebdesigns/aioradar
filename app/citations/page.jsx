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

function Sparkline({color="pink"}) {
  const colors = { pink:"#d8a0c8", purple:"#9b8af0", blue:"#8aa8e6" }
  const c = colors[color]
  return (
    <svg width="90" height="30" viewBox="0 0 90 30" className="opacity-80">
      <path d="M2 22 C10 20 18 24 28 14 C38 4 48 24 58 18 C68 12 78 16 86 8" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="86" cy="8" r="3" fill="white" stroke={c} strokeWidth="1.5"/>
    </svg>
  )
}

function StatCard({label, value, delta, color="green", spark="pink", icon}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white flex flex-col gap-4 min-h-[122px]">
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">{icon}</div>
        <Sparkline color={spark}/>
      </div>
      <div>
        <div className="text-[12px] text-gray-500">{label}</div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[22px] font-semibold tracking-tight text-gray-900">{value}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${color==="green" ? "bg-[#E6F4EA] text-[#1a7a2e]" : "bg-[#FDECEA] text-[#a33]"}`}>{delta}</span>
        </div>
      </div>
    </div>
  )
}

function BarRow({label, sub, value, width, tone="pink"}) {
  const colors = tone==="pink" ? "bg-[#e8a0c8]" : tone==="purple" ? "bg-[#9b8af0]" : "bg-[#8aa8e6]"
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="w-[92px] min-w-0">
        <div className="text-[12px] text-white/90 truncate">{label}</div>
        <div className="text-[9px] text-white/40 truncate">{sub}</div>
      </div>
      <div className="flex-1 flex gap-0.5">
        <div className="flex-1 h-3 rounded-full bg-white/15 overflow-hidden flex">
          <div className={`h-full rounded-full ${colors}`} style={{width: width}} />
          <div className="flex-1 flex gap-0.5 ml-0.5 opacity-30">
            {Array.from({length:18}).map((_,i)=><div key={i} className="w-0.5 h-3 bg-white/40 rounded-full" />)}
          </div>
        </div>
      </div>
      <div className="w-10 text-right text-white text-xs font-semibold">{value}</div>
    </div>
  )
}

const thirdPartySubs = ["forums & threads", "comparisons", "reviews & demos", "how-to guides", "reviews"]

function StatePill({state}) {
  if (state==="active") return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#1a7a2e]">Active</span>
  return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FDECEA] text-[#a33]">Lost</span>
}

function ThirdPartyCard({rows}) {
  return (
    <div className="bg-[#191919] rounded-[24px] p-5 shadow-sm flex flex-col text-white">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-[15px] font-semibold">Third-party sources</h3>
          <p className="text-[11px] text-white/50 mt-0.5">Domains capturing citations on your queries, last 30 days</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
          <Icon path={<path d="M7 17L17 7M9 7h8v8"/>} size={14}/>
        </button>
      </div>
      <div className="flex flex-col gap-3.5 mt-6 flex-1 justify-center">
        {rows.length===0 && <div className="text-xs text-white/50 text-center py-6">No third-party citations captured yet.</div>}
        {rows.map((v,i)=><BarRow key={v.domain} label={v.domain} sub={i<thirdPartySubs.length ? thirdPartySubs[i] : "other sources"} value={v.pct + "%"} width={Math.max(6, v.pct) + "%"} tone={["pink","purple","blue","purple","pink","blue"][i % 6]}/>)}
      </div>
    </div>
  )
}

function CitedPagesTable({rows}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Cited pages</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Pages of your domain cited inside Google AI Overviews</p>
        </div>
        <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Export citations</button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_0.8fr_0.8fr_40px] gap-4 px-2 py-3 border-b border-gray-100 text-[11px] text-gray-400 min-w-[760px]">
          <span>Page</span><span>Domain</span><span>Times cited</span><span>First seen</span><span>Last seen</span><span>Status</span><span/>
        </div>
        {rows.length===0 && (
          <div className="py-10 text-center text-xs text-gray-400">None of your pages cited yet — citations will appear here as AI Overviews start referencing yourbrand.com.</div>
        )}
        {rows.map(p=>(
          <div key={p.link} className="grid grid-cols-[2fr_1fr_0.8fr_1fr_0.8fr_0.8fr_40px] gap-4 px-2 py-3.5 items-center text-sm hover:bg-gray-50/60 rounded-2xl min-w-[760px]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                <Icon path={<><path d="M8 13V6a4 4 0 018 0v7"/><rect x="5" y="13" width="14" height="8" rx="3"/></>} size={13}/>
              </span>
              <span className="font-medium text-gray-900 truncate">{p.title || p.link}</span>
            </div>
            <span className="text-[13px] text-gray-500">yourbrand.com</span>
            <span className="text-[13px] text-gray-700 font-medium">{p.times}×</span>
            <span className="text-[13px] text-gray-400">{p.first}</span>
            <span className="text-[13px] text-gray-400">{p.last}</span>
            <StatePill state={p.state}/>
            <button className="justify-self-end w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">⋮</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CitationsPage() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetch("/api/citations")
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(setData)
      .catch(e => setErr(String(e)))
  }, [])

  return (
    <Shell crumb={["Dashboard","Citations"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Citations</h1>
            <p className="text-xs text-gray-400 mt-1">Which of your pages get quoted inside AI Overviews, and which sources beat you to it. {data && `${data.allCitations} citations on latest check "${data.day}".`}{err && <span className="text-[#a33]"> (API {err})</span>}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Export citations</button>
            <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Track new page</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <StatCard label="Citations in AIO" value={data ? String(data.allCitations) : "—"} delta={data?.hasPrev ? "tracked" : "day 1"} icon={<Icon path={<><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.5-1.5"/></>} size={14}/>}/>
          <StatCard label="Unique pages cited" value={data ? String(data.uniquePages) : "—"} delta={data?.hasPrev ? "tracked" : "day 1"} spark="purple" icon={<Icon path={<><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h4"/></>} size={14}/>}/>
          <StatCard label="Source diversity" value={data ? String(data.uniqueDomains) : "—"} delta={data?.hasPrev ? "tracked" : "day 1"} spark="blue" icon={<Icon path={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></>} size={14}/>}/>
          <StatCard label="Lost citations" value={data ? String(data.lostCitations) : "—"} delta={data?.hasPrev ? "vs prev" : "day 1"} color="red" icon={<Icon path={<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/></>} size={14}/>}/>
        </div>
      </div>

      <div className="mt-4">
        <CitedPagesTable rows={data?.citedPages ?? []}/>
      </div>

      <div className="mt-4">
        <ThirdPartyCard rows={data?.thirdParty ?? []}/>
      </div>
    </Shell>
  )
}
