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

const TAG_STYLES = {
  Brand: "bg-[#FDECF5] text-[#c2508a]",
  Comparison: "bg-[#EFECFF] text-[#6c5ce0]",
  Question: "bg-[#EAF2FF] text-[#3f6cc4]",
  Feature: "bg-[#EFF6EC] text-[#4a7c50]",
}

const TABS = [
  {key:"all", label:"All"},
  {key:"aio", label:"With AI Overview"},
  {key:"mention", label:"Mentioned"},
  {key:"cited", label:"Cited"},
  {key:"lost", label:"Missing citation"},
]

function matches(q, tab) {
  if (tab==="all") return true
  if (tab==="aio") return q.aio==="yes"
  if (tab==="mention") return q.aio==="yes" && q.mention
  if (tab==="cited") return q.aio==="yes" && q.citation
  if (tab==="lost") return q.citation===false && q.aio==="yes"
  return true
}

function TagChip({tag}) {
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_STYLES[tag] ?? "bg-gray-100 text-gray-400"}`}>{tag}</span>
}

function AioPill({state}) {
  return state==="yes"
    ? <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#1a7a2e]">Yes</span>
    : <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">No</span>
}

function Check({ok}) {
  if (ok === null) return <span className="text-gray-300 text-xs">&mdash;</span>
  return ok
    ? <span className="text-[#1a7a2e] text-sm">&#10003;</span>
    : <span className="text-[#a33] text-sm">&#10007;</span>
}

function monthDay(day) {
  if (!day) return "\u2014"
  const [y, m, d] = day.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

export default function QueriesPage() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState("loading")
  const [modal, setModal] = useState(false)
  const [kw, setKw] = useState("")
  const [country, setCountry] = useState("US")
  const [tag, setTag] = useState("Comparison")
  const [busy, setBusy] = useState(false)
  const [modalErr, setModalErr] = useState(null)

  function load() {
    setStatus("loading")
    Promise.all([
      fetch("/api/queries").then((r) => r.json()),
      fetch("/api/collect").then((r) => r.json()),
    ]).then(([queriesRes, collectRes]) => {
      const snapshots = collectRes.snapshots ?? []
      const latest = {}
      for (const s of snapshots) latest[s.queryId] = s
      const mapped = (queriesRes.queries ?? []).map((q) => {
        const s = latest[q.id]
        return {
          id: q.id,
          query: q.keyword,
          tag: q.tag,
          country: q.country,
          aio: s ? (s.hasAio ? "yes" : "no") : "\u2014",
          mention: s ? (s.hasAio ? s.mentionsBrand : null) : null,
          citation: s ? (s.hasAio ? s.brandCited : null) : null,
          top: s?.topDomain ?? "\u2014",
          last: s ? monthDay(s.day) : "Not checked",
        }
      })
      setRows(mapped)
      setStatus("ready")
    }).catch(() => setStatus("error"))
  }

  useEffect(load, [])

  async function addQuery() {
    if (!kw.trim() || busy) return
    setBusy(true)
    setModalErr(null)
    try {
      const r = await fetch("/api/queries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ keyword: kw.trim(), country, tag }),
      })
      if (!r.ok) throw new Error("HTTP " + r.status)
      setModal(false)
      setKw("")
      load()
    } catch (e) {
      setModalErr(String(e))
    } finally {
      setBusy(false)
    }
  }

  async function removeQuery(id) {
    try {
      await fetch("/api/queries?id=" + encodeURIComponent(id), { method: "DELETE" })
    } catch {}
    load()
  }

  const counts = {
    all: rows.length,
    aio: rows.filter(q=>matches(q,"aio")).length,
    mention: rows.filter(q=>matches(q,"mention")).length,
    cited: rows.filter(q=>matches(q,"cited")).length,
    lost: rows.filter(q=>matches(q,"lost")).length,
  }

  const visible = rows.filter(q =>
    matches(q, tab) && q.query.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Shell crumb={["Dashboard","Queries"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Tracked queries</h1>
            <p className="text-xs text-gray-400 mt-1">Every query is checked daily for AI Overview presence, brand mentions and domain citations.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Import CSV</button>
            <button onClick={()=>{ setModalErr(null); setModal(true) }} className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Add query</button>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-between flex-wrap mt-5">
          <div className="flex gap-1 bg-gray-50 rounded-full p-1 border border-gray-100 flex-wrap">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition ${tab===t.key ? "bg-black text-white" : "text-gray-400 hover:text-gray-600"}`}>
                {t.label} <span className={tab===t.key ? "text-white/60" : "text-gray-300"}>{counts[t.key]}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 w-[260px]">
            <Icon path={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>} className="text-gray-400" size={14}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search queries..." className="flex-1 text-xs outline-none bg-transparent placeholder:text-gray-400 text-gray-700"/>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="grid grid-cols-[2.3fr_0.8fr_0.9fr_0.7fr_0.7fr_1fr_0.8fr_40px] gap-4 px-2 py-3 border-b border-gray-100 text-[11px] text-gray-400 min-w-[900px]">
            <span>Query</span><span>Country</span><span>AI Overview</span><span>Mention</span><span>Cited</span><span>Top source</span><span>Last check</span><span/>
          </div>
          {status==="loading" && (
            <div className="py-10 text-center text-xs text-gray-400">Loading tracked queries...</div>
          )}
          {status==="error" && (
            <div className="py-10 text-center text-xs text-[#a33]">Could not load queries. Is the dev server running?</div>
          )}
          {status==="ready" && visible.length===0 && (
            <div className="py-10 text-center text-xs text-gray-400">No queries match this filter.</div>
          )}
          {visible.map(q=>(
            <div key={q.id} onClick={()=>q.aio==="yes" && window.location.assign(`/queries/${q.id}`)} className={`grid grid-cols-[2.3fr_0.8fr_0.9fr_0.7fr_0.7fr_1fr_0.8fr_40px] gap-4 px-2 py-3.5 items-center text-sm hover:bg-gray-50/60 rounded-2xl min-w-[900px] ${q.aio==="yes" ? "cursor-pointer" : ""}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-gray-900 truncate">{q.query}</span>
                <TagChip tag={q.tag}/>
              </div>
              <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5 w-fit">{q.country}</span>
              <AioPill state={q.aio}/>
              <Check ok={q.mention}/>
              <Check ok={q.citation}/>
              <span className="text-gray-500 text-[13px] truncate">{q.top}</span>
              <span className="text-gray-300 text-xs">{q.last}</span>
              <button onClick={(e)=>{ e.stopPropagation(); removeQuery(q.id) }} title="Delete query" className="justify-self-end w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#a33]">&#8942;</button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 px-2">
          <span className="text-[11px] text-gray-400">{status==="ready" ? `Showing ${visible.length} of ${rows.length} queries` : "..."}</span>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium text-gray-400 shadow-sm">&#8592; Prev</button>
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition">Next &#8594;</button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>!busy && setModal(false)}>
          <div className="bg-white rounded-[24px] p-6 w-full max-w-[420px] shadow-xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-gray-900">Add a tracked query</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">It will be checked on the next daily collect.</p>
            <div className="mt-4 space-y-3">
              <input autoFocus value={kw} onChange={e=>setKw(e.target.value)} onKeyDown={e=>e.key==="Enter" && addQuery()} placeholder="artificial intelligence, Real estate deals featured by" className="w-full text-xs bg-gray-50 border border-gray-100 rounded-full px-4 py-2.5 outline-none focus:border-gray-300 placeholder:text-gray-400"/>
              <div className="flex gap-2">
                <select value={country} onChange={e=>setCountry(e.target.value)} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-2 outline-none">
                  {["US","CA","FR","GB"].map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={tag} onChange={e=>setTag(e.target.value)} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-2 outline-none">
                  {["Brand","Comparison","Question","Feature"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              {modalErr && <div className="text-[11px] text-[#a33]">Failed to add query ({modalErr}).</div>}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={()=>setModal(false)} className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={addQuery} disabled={busy || !kw.trim()} className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition disabled:opacity-40">{busy ? "Adding..." : "Add query"}</button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}
