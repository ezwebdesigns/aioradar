"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const ICONS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></>,
  share: <><path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 21h14"/></>,
  doc: <><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>,
  card: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></>,
  logout: <><path d="M9 21H6a3 3 0 01-3-3V6a3 3 0 013-3h3"/><path d="M16 17l5-5-5-5M21 12H9"/></>,
}

function Icon({name, size=15}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  )
}

const ITEMS = [
  {name:"grid", href:"/", title:"Dashboard"},
  {name:"doc", href:"/queries", title:"Queries"},
  {name:"user", href:"/competitors", title:"Competitors"},
  {name:"share", href:"/citations", title:"Citations"},
  {name:"calendar", href:"/alerts", title:"Alerts"},
  {name:"chart", href:"/reports", title:"Reports"},
  {name:"shield", href:"/projects", title:"Projects"},
  {name:"card", href:"/settings", title:"Settings"},
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="w-[64px] bg-white rounded-full p-2 flex flex-col items-center gap-0.5 shadow-sm border border-white/60 h-fit">
      <Link href="/" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-400 to-pink-300 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full"/>
        </span>
      </Link>
      <div className="w-full h-px bg-gray-100 my-1"/>
      {ITEMS.map((item)=> {
        const active = item.href !== null && pathname === item.href
        const inner = <Icon name={item.name}/>
        const cls = `w-10 h-10 rounded-full flex items-center justify-center transition ${active ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`
        return item.href
          ? <Link key={item.name} href={item.href} title={item.title} className={cls}>{inner}</Link>
          : <button key={item.name} title={item.title} className={cls}>{inner}</button>
      })}
      <div className="w-full h-px bg-gray-100 my-1"/>
      <button title="Help" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50"><Icon name="info" size={14}/></button>
      <button title="Logout" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50"><Icon name="logout" size={14}/></button>
    </div>
  )
}
