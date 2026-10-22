import Sidebar from "./Sidebar"
import AvatarMenu from "./AvatarMenu"

function Pill({children}) {
  return <div className="rounded-full bg-white border border-gray-100 shadow-sm px-3 py-1.5 text-xs flex items-center gap-2 text-gray-600">{children}</div>
}

function Icon({path, className="", size=16}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  )
}

export default function Shell({crumb=["Dashboard","Overview"], children}) {
  return (
    <div className="min-h-screen p-3 md:p-5">
      <div className="w-full bg-[#FFFBF7]/70 backdrop-blur rounded-[32px] border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-3 md:p-4 flex gap-4">
        <div className="hidden md:block sticky top-4 self-start">
          <Sidebar/>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-sm border border-white flex-1 md:flex-none">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-300 flex items-center justify-center text-white text-xs">◈</div>
              <span className="text-xs text-gray-500">{crumb[0]}</span>
              <span className="text-gray-300">›</span>
              <span className="text-xs font-medium text-gray-900">{crumb[1]}</span>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-white w-[340px]">
                <Icon path={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>} className="text-gray-400" size={14}/>
                <input placeholder="Search users, queries, content..." className="flex-1 text-xs outline-none bg-transparent placeholder:text-gray-400 text-gray-700" />
                <span className="text-[10px] bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5 flex items-center gap-1 text-gray-400">⌘ K</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Pill><Icon path={<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/></>} size={13}/> 30 Days</Pill>
              <Pill><Icon path={<><path d="M12 3v12M6 11l6 6 6-6"/><path d="M5 21h14"/></>} size={13}/> Download</Pill>
              <AvatarMenu />
            </div>
          </div>

          {children}

          <div className="pb-4" />
        </div>
      </div>
    </div>
  )
}
