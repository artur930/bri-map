'use client';

import { useEffect, useRef } from 'react';

const TICKER_ITEMS = [
  'Gwadar Deep-Sea Port · Pakistan $1.62B // Operational',
  'Karakoram Highway Upgrade · Pakistan $1.3B // Under Construction',
  'China–Laos Railway · Laos $6.0B // Operational',
  'East Coast Rail Link · Malaysia $11.2B // Operational',
  'Jakarta–Bandung HSR · Indonesia $5.5B // Operational',
  'Sino-Oman Industrial City · Oman $10.7B // Under Construction',
  'Hambantota Port · Sri Lanka $1.3B // Operational',
  'Mombasa–Nairobi SGR · Kenya $3.2B // Operational',
  'Piraeus Port Expansion · Greece $4.3B // Operational',
  'Moscow–Kazan HSR · Russia $21.4B // Suspended',
];

interface TickerBarProps {
  date: string;
}

export default function TickerBar({ date }: TickerBarProps) {
  const tickerRef = useRef<HTMLDivElement>(null);

  // CSS animation handles the scroll — no JS needed for performance
  const tickerText = TICKER_ITEMS.join('   //   ');

  return (
    <div className="h-8 bg-[#0a0e1a] border-t border-[#1a2235] flex items-center gap-0 flex-shrink-0 overflow-hidden">
      {/* Live badge */}
      <div className="flex items-center gap-1.5 px-3 bg-orange-500 h-full flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-[9px] font-bold text-white tracking-[0.15em]">LIVE BRI FEED</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center border-r border-[#1a2235]">
        <div className="ticker-track whitespace-nowrap text-[10px] text-slate-400 font-mono absolute">
          <span>{tickerText}</span>
          <span className="ml-8">{tickerText}</span>
        </div>
      </div>

      {/* Right stats */}
      <div className="flex items-center gap-0 h-full flex-shrink-0">
        <TickerStat label="PROJECTS" value="35" />
        <TickerStat label="CAPITAL DEPLOYED" value="$112.7B" />
        <TickerStat label="COUNTRIES" value="26" />
        <TickerStat label="FEED" value={date} last />
      </div>
    </div>
  );
}

function TickerStat({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 h-full border-l border-[#1a2235] ${last ? '' : ''}`}>
      <span className="text-[8px] text-slate-600 font-bold tracking-wider">{label}</span>
      <span className="text-[9px] font-bold text-slate-300 font-mono">{value}</span>
    </div>
  );
}
