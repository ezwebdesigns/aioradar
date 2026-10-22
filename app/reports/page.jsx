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

const RECIPIENTS = ["#e8a0c8","#9b8af0","#8aa8e6","#c9a0d8"]

function StatusPill({status}) {
  if (status==="sent") return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#1a7a2e]">Sent</span>
  return <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">Draft</span>
}

function NoteChip({note}) {
  const tones = { green:"bg-[#E6F4EA] text-[#1a7a2e]", red:"bg-[#FDECEA] text-[#a33]", blue:"bg-[#EAF2FF] text-[#3f6cc4]" }
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tones[note.tone]}`}>{note.label}</span>
}

function ScheduleCard() {
  return (
    <div className="bg-[#191919] rounded-[24px] p-5 text-white flex flex-col">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-[15px] font-semibold">Weekly digest</h3>
          <p className="text-[11px] text-white/50 mt-0.5">Scheduled report, sent every Monday at 8:00am</p>
        </div>
        <span className="w-fit text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#2dd4a8]/15 text-[#3ecfae]">On</span>
      </div>
      <div className="divide-y divide-white/10 mt-4 flex-1">
        <div className="flex justify-between items-center py-3 text-sm">
          <span className="text-white/90">Next report</span>
          <span className="text-white/60 text-xs">Monday, Mar 23 — 8:00am</span>
        </div>
        <div className="flex justify-between items-center py-3 text-sm">
          <span className="text-white/90">Recipients</span>
          <div className="flex -space-x-2">
            {RECIPIENTS.map((c,i)=>(
              <span key={i} className="w-7 h-7 rounded-full border-2 border-[#191919] flex items-center justify-center text-[10px] font-semibold text-white" style={{backgroundColor:c}}>
                {["S","J","M","A"][i]}
              </span>
            ))}
            <span className="w-7 h-7 rounded-full border-2 border-[#191919] bg-white/10 flex items-center justify-center text-[10px] text-white/70">+2</span>
          </div>
        </div>
        <div className="flex justify-between items-center py-3 text-sm">
          <span className="text-white/90">Contents</span>
          <span className="text-white/60 text-xs">Metrics · Changes · Recommendations</span>
        </div>
      </div>
    </div>
  )
}

function ReportsTable({data}) {
  const weekly = data && {
    week: "Week of " + (data.day ?? "—"),
    period: "Daily collect " + (data.day ?? "—"),
    coverage: (data.coverage?.value ?? 0) + "%",
    status: "draft",
    recipients: 0,
    opened: "—",
    notes: [
      ...(data.coverage?.aiCount ? [{label: `AI Overviews on ${data.coverage.aiCount} queries`, tone: "blue"}] : []),
      ...(data.changes ?? []).filter(c => c.type.startsWith("citation")).map(c => ({ label: c.type.endsWith("gained") ? "+1 citation" : "−1 citation", tone: c.type.endsWith("gained") ? "green" : "red" })),
      ...(data.changes ?? []).filter(c => c.type.startsWith("mention")).map(c => ({ label: c.type.endsWith("gained") ? "+1 mention" : "−1 mention", tone: c.type.endsWith("gained") ? "green" : "red" })),
    ],
  }
  const rows = weekly ? [weekly] : []
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Past reports</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Weekly digests and one-off exports</p>
        </div>
        <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Generate report</button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="grid grid-cols-[0.8fr_1.2fr_0.8fr_0.9fr_1.9fr_0.8fr_0.8fr_40px] gap-4 px-2 py-3 border-b border-gray-100 text-[11px] text-gray-400 min-w-[900px]">
          <span>Report</span><span>Period</span><span>Coverage</span><span>Status</span><span>Highlights</span><span>Opened</span><span>Recipients</span><span/>
        </div>
        {rows.length===0 && (
          <div className="py-10 text-center text-xs text-gray-400">{data ? "First weekly digest will appear after the next daily collect." : "Loading reports..."}</div>
        )}
        {rows.map(r=>(
          <div key={r.week} className="grid grid-cols-[0.8fr_1.2fr_0.8fr_0.9fr_1.9fr_0.8fr_0.8fr_40px] gap-4 px-2 py-3.5 items-center text-sm hover:bg-gray-50/60 rounded-2xl min-w-[900px]">
            <span className="font-medium text-gray-900">{r.week}</span>
            <span className="text-[13px] text-gray-500">{r.period}</span>
            <span className="text-[13px] text-gray-700 font-medium">{r.coverage}</span>
            <StatusPill status={r.status}/>
            <div className="flex gap-1.5 flex-wrap">{r.notes.map((n,i)=><NoteChip key={i} note={n}/>)}</div>
            <span className="text-[13px] text-gray-500">{r.opened}</span>
            <span className="text-[13px] text-gray-500">{r.recipients ? `${r.recipients} sent` : "—"}</span>
            <button className="justify-self-end w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">⋮</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetch("/api/alerts")
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(setData)
      .catch(e => setErr(String(e)))
  }, [])

  return (
    <Shell crumb={["Dashboard","Reports"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Reports</h1>
            <p className="text-xs text-gray-400 mt-1">Client-ready weekly digests: your 10 biggest AI visibility gains and losses.{err && <span className="text-[#a33]"> (API {err})</span>}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">View templates</button>
            <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Generate report</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4 mt-4">
        <ScheduleCard/>
        <ReportsTable data={err ? null : data}/>
      </div>
    </Shell>
  )
}
