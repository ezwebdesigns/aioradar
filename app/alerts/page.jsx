"use client"

import { useState, useEffect } from "react"
import Shell from "../../components/Shell"

function Icon({path, className="", size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  )
}

const TYPE_STYLES = {
  gained: {bg:"bg-[#E6F4EA] text-[#1a7a2e]", icon:<path d="M12 5v14M5 12h14"/>},
  lost: {bg:"bg-[#FDECEA] text-[#a33]", icon:<path d="M6 6l12 12M18 6L6 18"/>},
  competitor: {bg:"bg-[#EFECFF] text-[#6c5ce0]", icon:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></>},
  aio: {bg:"bg-[#EAF2FF] text-[#3f6cc4]", icon:<path d="M13 3L4 14h6l-1 7 9-11h-6z"/>},
  mention: {bg:"bg-[#FDECF5] text-[#c2508a]", icon:<><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.9 7.9"/></>},
}

const TITLE_BY_TYPE = {
  "aio-gained":   { type: "aio",      cat: "aio",         title: "New AI Overview detected", detail: "AI Overview appeared on this query today" },
  "aio-lost":     { type: "aio",      cat: "aio",         title: "AI Overview disappeared",  detail: "No AI Overview on this query anymore" },
  "citation-gained": { type: "gained", cat: "citations",  title: "Citation regained",        detail: "yourbrand.com back in cited sources" },
  "citation-lost":   { type: "lost",   cat: "citations",  title: "Citation lost",            detail: "yourbrand.com no longer cited" },
  "mention-gained":  { type: "mention", cat: "mentions",  title: "Mention gained",           detail: "Your brand now appears in the generated text" },
  "mention-lost":    { type: "mention", cat: "mentions",  title: "Mention lost",             detail: "Your brand no longer mentioned" },
  "position-gained": { type: "gained",  cat: "citations", title: "Organic position gained",  detail: "Your site moved up in organic results" },
  "position-lost":   { type: "lost",    cat: "citations", title: "Organic position lost",    detail: "Your site dropped in organic results" },
}

const TABS = [
  {key:"all", label:"All"},
  {key:"citations", label:"Citations"},
  {key:"competitors", label:"Competitors"},
  {key:"mentions", label:"Mentions"},
  {key:"aio", label:"AI Overviews"},
]

const CHANNELS = [
  {name:"Email", detail:"sarah@yourbrand.com", state:"on"},
  {name:"Slack", detail:"#aio-visibility", state:"on"},
  {name:"Weekly digest", detail:"Monday, 8:00am", state:"on"},
]

function ChannelRow({ch}) {
  return (
    <div className="flex items-center justify-between gap-4 px-2 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
          <Icon path={ch.name==="Slack" ? <><rect x="7" y="7" width="4" height="4" rx="1"/><rect x="13" y="13" width="4" height="4" rx="1"/><rect x="13" y="7" width="4" height="4" rx="1"/><rect x="7" y="13" width="4" height="4" rx="1"/></> : ch.name==="Email" ? <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/></> : <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/></>} size={14}/>
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900">{ch.name}</div>
          <div className="text-xs text-gray-400 truncate">{ch.detail}</div>
        </div>
      </div>
      <button className="w-fit text-[11px] font-medium px-3 py-1.5 rounded-full bg-[#E6F4EA] text-[#1a7a2e] hover:bg-[#d9eede] transition">On</button>
    </div>
  )
}

export default function AlertsPage() {
  const [tab, setTab] = useState("all")
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetch("/api/alerts")
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(setData)
      .catch(e => setErr(String(e)))
  }, [])

  const changes = data?.changes ?? []
  const feed = changes.map((c, i) => {
    const ttl = TITLE_BY_TYPE[c.type] ?? { type: "competitor", cat: "competitors", title: "Visibility change", detail: "Citation mix changed on this query" }
    return {
      ...ttl,
      detail: c.type === "position-gained" || c.type === "position-lost" ? `#${c.from} -> #${c.to} in organic results` : ttl.detail,
      query: c.keyword,
      when: c.day,
      key: i,
    }
  })

  const counts = {
    all: feed.length,
    citations: feed.filter(a=>a.cat==="citations").length,
    competitors: feed.filter(a=>a.cat==="competitors").length,
    mentions: feed.filter(a=>a.cat==="mentions").length,
    aio: feed.filter(a=>a.cat==="aio").length,
  }

  const rows = feed.filter(a => tab==="all" || a.cat===tab)
  const citationLosses = feed.filter(a => a.type === "citation-lost").length
  const aioMoves = counts.aio
  const competitorMoves = feed.filter(a => a.type === "position-gained" || a.type === "position-lost").length

  return (
    <Shell crumb={["Dashboard","Alerts"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Alerts</h1>
            <p className="text-xs text-gray-400 mt-1">What changed in your AI visibility today, across {data?.queryCount ?? "—"} tracked queries{err && <span className="text-[#a33]"> (API {err})</span>}.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Mark all as read</button>
            <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Add alert rule</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <div className="bg-gray-50/60 rounded-[20px] border border-gray-100 p-4">
            <h3 className="text-[13px] font-semibold text-gray-900 px-2 pt-1">Delivery channels</h3>
            <div className="divide-y divide-gray-100 mt-1">
              {CHANNELS.map(ch=><ChannelRow key={ch.name} ch={ch}/>)}
            </div>
          </div>
          <div className="bg-gray-50/60 rounded-[20px] border border-gray-100 p-4 flex flex-col">
            <h3 className="text-[13px] font-semibold text-gray-900 px-2 pt-1">This week at a glance</h3>
            <div className="grid grid-cols-3 gap-3 mt-2 px-2 pb-1 flex-1 items-center">
              <div className="bg-white rounded-2xl border border-gray-100 p-3">
                <div className="text-[10px] text-gray-400">Citation losses</div>
                <div className="text-[18px] font-semibold text-gray-900 mt-1">{data ? citationLosses : "—"}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-3">
                <div className="text-[10px] text-gray-400">AIO moves</div>
                <div className="text-[18px] font-semibold text-gray-900 mt-1">{data ? aioMoves : "—"}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-3">
                <div className="text-[10px] text-gray-400">Position moves</div>
                <div className="text-[18px] font-semibold text-gray-900 mt-1">{data ? competitorMoves : "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white mt-4">
        <div className="flex items-center gap-3 justify-between flex-wrap">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">Alert feed</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Chronological feed of visibility changes</p>
          </div>
          <div className="flex gap-1 bg-gray-50 rounded-full p-1 border border-gray-100 flex-wrap">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition ${tab===t.key ? "bg-black text-white" : "text-gray-400 hover:text-gray-600"}`}>
                {t.label} <span className={tab===t.key ? "text-white/60" : "text-gray-300"}>{counts[t.key]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100/80 mt-4">
          {rows.length===0 && (
            <div className="py-10 text-center text-xs text-gray-400">{data ? (data.hasPrev ? "No alerts in this category." : "First daily check recorded — changes will appear from the next collect.") : "Loading alerts..."}</div>
          )}
          {rows.map((a,i)=>(
            <div key={i} className="flex items-center gap-4 py-3.5 px-2 rounded-2xl hover:bg-gray-50/60">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TYPE_STYLES[a.type].bg}`}>
                <Icon path={TYPE_STYLES[a.type].icon} size={14}/>
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{a.title}</div>
                <div className="text-xs text-gray-400 truncate">{a.detail}</div>
                <div className="text-[10px] text-gray-300 truncate mt-0.5">{a.query}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-gray-300">{a.when}</span>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">↗</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
