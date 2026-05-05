'use client';

import { CORRIDORS } from '@/data/corridors';

const INFRA_TYPES = [
  { icon: '◆', label: 'Ports', count: 7, id: 'ports' },
  { icon: '—', label: 'Rail', count: 12, id: 'rail' },
  { icon: '—', label: 'Highways', count: 6, id: 'highways' },
  { icon: '▲', label: 'Airports', count: 2, id: 'airports' },
  { icon: '✦', label: 'Energy', count: 3, id: 'energy' },
  { icon: '⊞', label: 'Ind. Zones', count: 3, id: 'ind_zones' },
  { icon: '◆', label: 'Digital', count: 2, id: 'digital' },
];

interface LeftPanelProps {
  activeCorridors: Set<string>;
  activeInfra: Set<string>;
  onToggleCorridor: (id: string) => void;
  onToggleInfra: (id: string) => void;
  searchQuery: string;
}

export default function LeftPanel({
  activeCorridors,
  activeInfra,
  onToggleCorridor,
  onToggleInfra,
  searchQuery,
}: LeftPanelProps) {
  const filteredCorridors = CORRIDORS.filter(c =>
    searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-[272px] flex-shrink-0 bg-[#0d111c] border-r border-[#1a2235] flex flex-col overflow-hidden">
      {/* CORRIDORS */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em]">Corridors</span>
          <span className="text-[9px] text-slate-600 bg-[#111827] border border-[#1a2235] rounded-full px-1.5 py-0.5 font-mono">{CORRIDORS.length}</span>
        </div>
        <div className="space-y-0.5">
          {filteredCorridors.map(c => {
            const active = activeCorridors.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => onToggleCorridor(c.id)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all group ${
                  active
                    ? 'bg-white/[0.06] text-white'
                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-400'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-opacity"
                  style={{ backgroundColor: c.color, opacity: active ? 1 : 0.4 }}
                />
                <span className="text-[11px] leading-tight flex-1 min-w-0">{c.name}</span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: active ? `${c.color}22` : 'transparent',
                    color: active ? c.color : '#475569',
                    border: `1px solid ${active ? `${c.color}44` : '#1a2235'}`,
                  }}
                >
                  {c.projectCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-3 h-px bg-[#1a2235]" />

      {/* INFRASTRUCTURE */}
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em]">Infrastructure</span>
          <span className="text-[9px] text-slate-600 bg-[#111827] border border-[#1a2235] rounded-full px-1.5 py-0.5 font-mono">7</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INFRA_TYPES.map(item => {
            const active = activeInfra.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggleInfra(item.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] transition-all border ${
                  active
                    ? 'bg-[#1a2235] border-[#2d3f5a] text-slate-200'
                    : 'bg-transparent border-[#1a2235] text-slate-600 hover:border-[#2d3f5a] hover:text-slate-400'
                }`}
              >
                <span className={active ? 'text-slate-400' : 'text-slate-700'}>{item.icon}</span>
                <span>{item.label}</span>
                <span className={`font-mono ml-0.5 ${active ? 'text-slate-400' : 'text-slate-700'}`}>{item.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-3 h-px bg-[#1a2235]" />

      {/* PORTFOLIO */}
      <div className="px-3 py-2.5">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em] block mb-3">Portfolio</span>
        <div className="space-y-3">
          <PortfolioStat label="Projects tracked" value="35" />
          <PortfolioStat label="Total investment" value="$112.7B" accent />
          <PortfolioStat label="Operational" value="25" green />
          <PortfolioStat label="Under construction" value="8" amber />
          <PortfolioStat label="Planned / suspended" value="2" muted />
        </div>
      </div>

      <div className="mx-3 h-px bg-[#1a2235]" />

      {/* LEGEND */}
      <div className="px-3 py-2.5 mt-auto">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em] block mb-2">Route Status</span>
        <div className="space-y-1.5">
          <LegendItem color="#22c55e" label="Operational" solid />
          <LegendItem color="#f59e0b" label="Under Construction" dashed />
          <LegendItem color="#475569" label="Planned" dotted />
          <LegendItem color="#06b6d4" label="Maritime (animated)" dashed />
        </div>
      </div>
    </aside>
  );
}

function PortfolioStat({ label, value, accent, green, amber, muted }: {
  label: string; value: string; accent?: boolean; green?: boolean; amber?: boolean; muted?: boolean;
}) {
  const valueClass = green ? 'text-green-400' : amber ? 'text-amber-400' : muted ? 'text-slate-500' : accent ? 'text-white' : 'text-slate-200';
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className={`text-[13px] font-bold tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

function LegendItem({ color, label, solid, dashed, dotted }: {
  color: string; label: string; solid?: boolean; dashed?: boolean; dotted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-8 flex-shrink-0">
        {solid && <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 rounded-full" style={{ backgroundColor: color }} />}
        {dashed && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 rounded-full" style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} 4px, transparent 4px, transparent 7px)`,
          }} />
        )}
        {dotted && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 rounded-full" style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} 2px, transparent 2px, transparent 5px)`,
          }} />
        )}
      </div>
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
