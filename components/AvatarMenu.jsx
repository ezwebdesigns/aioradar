"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("") || "··";
}

export default function AvatarMenu() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!ready) {
    return <div className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm animate-pulse" />;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-400 flex items-center justify-center text-white text-xs font-semibold shadow-sm border border-white"
        aria-label="Account menu"
      >
        {initials(user?.name)}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-60 bg-white rounded-2xl border border-gray-100 shadow-lg p-2">
          <div className="px-3 py-2">
            <div className="text-sm font-medium text-gray-900 truncate">{user?.name}</div>
            <div className="text-[11px] text-gray-400 truncate">{user?.email}</div>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
