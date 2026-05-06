'use client';

// Ticker content matches spec exactly
const TICKER_TEXT =
  'Gwadar Deep-Sea Port · Pakistan $1.62B // Operational ' +
  '··· ' +
  'KARAKO · Karakoram Highway Upgrade · Pak $890M // Under Construction ' +
  '··· ' +
  'MOMBASA · Mombasa Port Expansion · Kenya $480M // Operational ' +
  '··· ' +
  'East Coast Rail Link · Malaysia $11.2B // Operational ' +
  '··· ' +
  'Jakarta–Bandung HSR · Indonesia $5.5B // Operational ' +
  '··· ' +
  'China–Laos Railway · Laos $6.0B // Operational ' +
  '··· ' +
  'Moscow–Kazan HSR · Russia $21.4B // Suspended ' +
  '··· ' +
  'Sino-Oman Industrial City · Oman $10.7B // Under Construction ' +
  '··· ' +
  'Piraeus Port Expansion · Greece $4.3B // Operational ' +
  '··· ' +
  'Hambantota Port · Sri Lanka $1.3B // Operational';

interface TickerBarProps {
  date: string;
}

export default function TickerBar({ date }: TickerBarProps) {
  return (
    <div className="h-8 bg-[#080c14] border-t border-[#1a2235] flex items-center flex-shrink-0 overflow-hidden">
      {/* Live badge */}
      <div className="flex items-center gap-1.5 px-3 bg-orange-500 h-full flex-shrink-0 border-r border-orange-600/30">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-[9px] font-bold text-white tracking-[0.12em] whitespace-nowrap">LIVE BRI FEED</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="ticker-track whitespace-nowrap text-[10px] text-slate-400 font-mono absolute left-0">
          <span className="pr-16">{TICKER_TEXT}</span>
          <span className="pr-16">{TICKER_TEXT}</span>
        </div>
      </div>

      {/* Right stats */}
      <div className="flex items-center h-full border-l border-[#1a2235] flex-shrink-0">
        <TickerStat label="PROJECTS" value="35" />
        <TickerStat label="CAPITAL DEPLOYED" value="$112.7B" />
        <TickerStat label="COUNTRIES" value="26" />
        <TickerStat label="FEED" value={date} />
      </div>
    </div>
  );
}

function TickerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 h-full border-l border-[#1a2235] first:border-l-0">
      <span className="text-[7px] font-bold text-slate-600 tracking-widest uppercase whitespace-nowrap">{label}</span>
      <span className="text-[9px] font-bold text-slate-300 font-mono tabular-nums whitespace-nowrap">{value}</span>
    </div>
  );
}
