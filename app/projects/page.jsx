import Shell from "../../components/Shell"

function Icon({path, className="", size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  )
}

const PROJECTS = [
  {
    name:"Yourbrand", domain:"yourbrand.com", color:"#e8a0c8", plan:"Growth", state:"active",
    queries:120, competitors:6, countries:4, visibility:49,
    tags:["This project"],
  },
  {
    name:"Acme Skincare", domain:"acmeskincare.io", color:"#9b8af0", plan:"Starter", state:"trial",
    queries:35, competitors:2, countries:1, visibility:21,
    tags:["Client"],
  },
  {
    name:"Bloom Furniture", domain:"bloomfurniture.fr", color:"#8aa8e6", plan:"Starter", state:"trial",
    queries:18, competitors:1, countries:2, visibility:12,
    tags:["Client"],
  },
]

const CIRCLES = {
  active: {pill:"bg-[#E6F4EA] text-[#1a7a2e]", label:"Active"},
  trial: {pill:"bg-[#EAF2FF] text-[#3f6cc4]", label:"Trial"},
}

function ProjectCard({p}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{backgroundColor:p.color}}>{p.name[0]}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
            <div className="text-[11px] text-gray-400 truncate">{p.domain}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {p.tags.map(t=><span key={t} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${t==="This project" ? "bg-[#FDECF5] text-[#c2508a]" : "bg-[#EFECFF] text-[#6c5ce0]"}`}>{t}</span>)}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
          <span>Visibility score</span>
          <span className="font-medium text-gray-900">{p.visibility}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${p.state==="active" ? "bg-[#e8a0c8]" : "bg-gray-300"}`} style={{width:`${p.visibility}%`}}/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50/70 rounded-2xl border border-gray-100 py-3">
          <div className="text-[16px] font-semibold text-gray-900">{p.queries}</div>
          <div className="text-[10px] text-gray-400">Queries</div>
        </div>
        <div className="bg-gray-50/70 rounded-2xl border border-gray-100 py-3">
          <div className="text-[16px] font-semibold text-gray-900">{p.competitors}</div>
          <div className="text-[10px] text-gray-400">Competitors</div>
        </div>
        <div className="bg-gray-50/70 rounded-2xl border border-gray-100 py-3">
          <div className="text-[16px] font-semibold text-gray-900">{p.countries}</div>
          <div className="text-[10px] text-gray-400">Countries</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{p.plan}</span>
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${CIRCLES[p.state].pill}`}>{CIRCLES[p.state].label}</span>
        </div>
        <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">Open</button>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Shell crumb={["Dashboard","Projects"]}>
      <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-white">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-900">Projects</h1>
            <p className="text-xs text-gray-400 mt-1">Each project is one brand: its queries, competitors, countries and subscription.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-xs font-medium shadow-sm hover:bg-gray-50 transition">Manage clients</button>
            <button className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-800 transition">New project</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {PROJECTS.map(p=><ProjectCard key={p.name} p={p}/>)}
        <div className="bg-white/50 rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 py-10 min-h-[240px] hover:bg-gray-50/60 transition cursor-pointer">
          <span className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400">
            <Icon path={<path d="M12 5v14M5 12h14"/>} size={16}/>
          </span>
          <span className="text-xs font-medium text-gray-500">Add a project</span>
          <span className="text-[10px] text-gray-400">Agency plan: add unlimited client brands</span>
        </div>
      </div>
    </Shell>
  )
}
