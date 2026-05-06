'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  energyMode: boolean;
  riskMode: boolean;
  onEnergyToggle: () => void;
  onRiskToggle: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  energyMode,
  riskMode,
  onEnergyToggle,
  onRiskToggle,
}: HeaderProps) {
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
    <header className="h-11 bg-[#080c14] border-b border-[#1a2235] flex items-center gap-3 px-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
          </svg>
        </div>
        <div className="leading-none">
          <div className="text-[13px] font-bold text-white tracking-tight">BRI Atlas</div>
          <div className="text-[8px] text-slate-500 tracking-[0.14em] font-medium">BELT & ROAD · LIVE PROJECT MAP</div>
        </div>
      </div>

      <div className="w-px h-5 bg-[#1a2235] mx-0.5 flex-shrink-0" />

      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search project, country, ope..."
          className="w-full bg-[#111827] border border-[#1a2235] rounded-lg pl-8 pr-12 py-1.5 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-[#2d3f5a] transition-colors"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-slate-700 bg-[#080c14] border border-[#1a2235] rounded px-1.5 py-0.5 font-mono pointer-events-none">⌘K</kbd>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onEnergyToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
            energyMode
              ? 'bg-yellow-500/25 border-yellow-500/50 text-yellow-300'
              : 'bg-yellow-500/8 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/15'
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          ENERGY MAP
          {energyMode && <span className="w-1 h-1 rounded-full bg-yellow-400" />}
        </button>

        <button
          onClick={onRiskToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
            riskMode
              ? 'bg-red-500/25 border-red-500/50 text-red-300'
              : 'bg-red-500/8 border-red-500/20 text-red-500 hover:bg-red-500/15'
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          RISK
          {riskMode && <span className="w-1 h-1 rounded-full bg-red-400" />}
        </button>

        <button className="relative flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111827] border border-[#1a2235] rounded-lg text-slate-400 text-[10px] font-bold tracking-wide hover:bg-[#161e2e] hover:text-slate-300 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          UPDATES
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold px-0.5 leading-none">
            5+
          </span>
        </button>
      </div>

      {/* Right status */}
      <div className="ml-auto flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-bold text-green-400 tracking-widest">STREAMING</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono tabular-nums">{utcTime}</span>
        <span className="text-[9px] text-slate-600 font-mono">v2.4 · 2026-Q2</span>
      </div>
    </header>
  );
}
