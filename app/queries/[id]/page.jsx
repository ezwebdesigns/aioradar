"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Shell from "../../../components/Shell"

const TAG_STYLES = {
  Brand: "bg-[#FDECF5] text-[#c2508a]",
  Comparison: "bg-[#EFECFF] text-[#6c5ce0]",
  Question: "bg-[#EAF2FF] text-[#3f6cc4]",
  Feature: "bg-[#EFF6EC] text-[#4a7c50]",
}

function Icon({path, className="", size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  )
}

function AioPill({state}) {
  return state==="yes"
    ? <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#1a7a2e]">Yes</span>
    : <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">No</span>
}

function Check({ok}) {
  if (ok === null) return <span className="text-gray-300 text-xs">—</span>
  return ok
    ? <span className="text-[#1a7a2e] text-sm">&#10003;</span>
    : <span className="text-[#a33] text-sm;">&#10007;</span>
}

function monthDay(day) {
  const [y, m, d] = day.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })
}

function StatusBox({label, value, sub}) {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-white">
      <div className="text-[11px] text-gray-400">{label}</div>
      <div className="text-[17px] font-semibold text-gray-900 mt-1">{value}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function QueryDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch("/api/queries").then((r) => r.json()),
      fetch("/api/collect").then((r) => r.json()),
    ]).then(([queriesRes, collectRes]) => {
      if (!alive) return
      const query = (queriesRes.queries ?? []).find((q) => q.id === id)
      const history = (collectRes.snapshots ?? [])
        .filter((s) => s.queryId === id)
        .sort((a, b) => (a.day < b.day ? 1 : -1))
      setData({ query, history, mode: collectRes.mode })
      setStatus("ready")
    }).catch(() => alive && setStatus("error"))
    return () => { alive = false }
  }, [id])

  if (status === "loading") {
    return <Shell crumb={["Dashboard","Queries","AI Overview"]}><div className="py-16 text-center text-xs text-gray-400">Loading query...</div></Shell>
  }
  if (status === "error" || !data?.query) {
    return <Shell crumb={["Dashboard","Queries","AI Overview"]}><div className="py-16 text-center text-xs text-[#a33]">Query not found.</div></Shell>
  }

  const { query, history } = data
  const latest = history[0]
  const next = history[1]
  const dif = (field) => (latest && next ? latest[field] !== next[field] : false)

  return (
    <Shell crumb={["Dashboard","Queries","AI Overview"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-semibold text-gray-900">{query.keyword}</h1>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_STYLES[query.tag] ?? "bg-gray-100 text-gray-400"}`}>{query.tag}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Country: {query.country} &middot; Latest check: {latest ? monthDay(latest.day) : "\u2014"} &middot; Data source: {data.mode === "live" ? "HasData" : "mock"}</p>
          </div>
          <Link href="/queries" className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Back to queries</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
          <StatusBox label="AI Overview" value={latest ? <AioPill state={latest.hasAio ? "yes" : "no"}/> : "\u2014"}/>
          <StatusBox label="Brand mention" value={<Check ok={latest ? latest.mentionsBrand : null}/>}/>
          <StatusBox label="Brand cited" value={<Check ok={latest ? latest.brandCited : null}/>}/>
          <StatusBox label="Organic position" value={latest?.ourOrganicPosition ?? "\u2014"} sub={dif("ourOrganicPosition") ? "changed today" : "top 10 only"}/>
          <StatusBox label="Top source" value={<span className="text-[14px]">{latest?.topDomain ?? "\u2014"}</span>} sub={dif("topDomain") ? "changed today" : null}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4 mt-4">
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
          <h3 className="text-[15px] font-semibold text-gray-900">AI Overview text</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Generated answer as served on the date of checks</p>
          {latest?.aio?.text ? (
            <p className="text-[13px] text-gray-600 leading-relaxed mt-4 whitespace-pre-wrap">{latest.aio.text}</p>
          ) : latest?.hasAio ? (
            <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center">
              <p className="text-xs text-gray-500">AI Overview present on this day, but full text will only be stored from the next daily collect on.</p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center">
              <p className="text-xs text-gray-500">No AI Overview was shown for this query on the latest check.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
          <h3 className="text-[15px] font-semibold text-gray-900">Sources cited in AIO</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Domains referenced in the generated answer</p>
          <div className="flex flex-col gap-2 mt-4">
            {(latest?.aio?.sources?.length ? latest.aio.sources : latest?.citedDomains?.map((d) => ({ domain: d }))).map((s, i) => (
              <div key={`${s.domain}-${i}`} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                <span className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-500">{s.domain?.[0]?.toUpperCase() ?? "?"}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-gray-900 truncate">{s.domain}</div>
                  {s.title && <div className="text-[11px] text-gray-400 truncate">{s.title}</div>}
                </div>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-700 shrink-0">
                    <Icon path={<path d="M7 17L17 7M9 7h8v8"/>} size={14}/>
                  </a>
                )}
              </div>
            ))}
            {!latest?.hasAio && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center text-xs text-gray-500">No citations — AIO absent.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white mt-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">Check history</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{history.length} daily check{history.length === 1 ? "" : "s"} collected</p>
          </div>
          <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Export history</button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.9fr_1fr] gap-4 px-2 py-3 border-b border-gray-100 text-[11px] text-gray-400 min-w-[700px]">
            <span>Date</span><span>AI Overview</span><span>Mention</span><span>Cited</span><span>Position</span><span>Top source</span>
          </div>
          {history.map((h) => (
            <div key={h.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.9fr_1fr] gap-4 px-2 py-3.5 items-center text-sm hover:bg-gray-50/60 rounded-2xl min-w-[700px]">
              <span className="font-medium text-gray-900">{monthDay(h.day)}</span>
              <AioPill state={h.hasAio ? "yes" : "no"}/>
              <Check ok={h.mentionsBrand}/>
              <Check ok={h.brandCited}/>
              <span className="text-gray-500 text-[13px]">{h.ourOrganicPosition ?? "\u2014"}</span>
              <span className="text-gray-500 text-[13px] truncate">{h.topDomain ?? "\u2014"}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
