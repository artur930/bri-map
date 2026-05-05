'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-11 bg-[#0a0e1a] border-b border-[#1a2235] flex items-center gap-3 px-4 flex-shrink-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
          </svg>
        </div>
        <div className="leading-none">
          <div className="text-[13px] font-bold text-white tracking-tight">BRI Atlas</div>
          <div className="text-[8px] text-slate-500 tracking-[0.15em] font-medium">BELT & ROAD · LIVE PROJECT MAP</div>
        </div>
      </div>

      <div className="w-px h-6 bg-[#1a2235] mx-1" />

      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search project, country, ope..."
          className="w-full bg-[#111827] border border-[#1a2235] rounded-lg pl-8 pr-12 py-1.5 text-[12px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-[#2d3f5a] transition-colors"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 bg-[#0a0e1a] border border-[#1a2235] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-500/10 border border-yellow-500/25 rounded-lg text-yellow-400 text-[11px] font-bold tracking-wide hover:bg-yellow-500/15 transition-colors">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          ENERGY MAP
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-[11px] font-bold tracking-wide hover:bg-red-500/15 transition-colors">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          RISK
        </button>
        <button className="relative flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111827] border border-[#1a2235] rounded-lg text-slate-300 text-[11px] font-bold tracking-wide hover:bg-[#161e2e] transition-colors">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          UPDATES
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold px-0.5">5+</span>
        </button>
      </div>

      {/* Right status */}
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold text-green-400 tracking-widest">STREAMING</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono tabular-nums">{utcTime}</span>
        <span className="text-[10px] text-slate-600 font-mono">v2.4 · 2026-Q2</span>
      </div>
    </header>
  );
}
