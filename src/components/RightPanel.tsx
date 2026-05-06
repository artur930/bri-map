'use client';

import { MapMarker } from '@/data/mapMarkers';

const PORTFOLIO_MIX = [
  { label: 'Rail', count: 12, max: 12, color: '#eab308' },
  { label: 'Ports', count: 7, max: 12, color: '#06b6d4' },
  { label: 'Highways', count: 6, max: 12, color: '#22c55e' },
  { label: 'Energy', count: 3, max: 12, color: '#f97316' },
  { label: 'Ind. Zones', count: 3, max: 12, color: '#8b5cf6' },
  { label: 'Airports', count: 2, max: 12, color: '#3b82f6' },
  { label: 'Digital', count: 2, max: 12, color: '#ec4899' },
];

const TOP_PROJECTS = [
  { name: 'Moscow–Kazan HSR', country: 'RUSSIA', value: '$21.4B', status: 'Suspended' },
  { name: 'East Coast Rail Link', country: 'MALAYSIA', value: '$11.2B', status: 'Operational' },
  { name: 'Sino-Oman Industrial City', country: 'OMAN', value: '$10.7B', status: 'Under Construction' },
  { name: 'Karachi Circular Railway', country: 'PAKISTAN', value: '$6.2B', status: 'Planned' },
  { name: 'Jakarta–Bandung HSR', country: 'INDONESIA', value: '$5.5B', status: 'Operational' },
  { name: 'China–Laos Railway', country: 'LAOS', value: '$6.0B', status: 'Operational' },
];

const STATUS_COLORS: Record<string, string> = {
  Operational: '#22c55e',
  'Under Construction': '#f59e0b',
  Planned: '#94a3b8',
  Suspended: '#ef4444',
  'Partner Node': '#8b5cf6',
  'Coordination Hub': '#ef4444',
};

interface RightPanelProps {
  selectedMarker: MapMarker | null;
  onClearSelection: () => void;
}

export default function RightPanel({ selectedMarker, onClearSelection }: RightPanelProps) {
  return (
    <aside className="w-[272px] flex-shrink-0 bg-[#0d111c] border-l border-[#1a2235] flex flex-col overflow-y-auto custom-scroll">

      {/* OVERVIEW Header */}
      <div className="px-4 pt-3 pb-3 border-b border-[#1a2235]">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em]">Overview · 2026 Q2</span>
          </div>
          <span className="text-[8px] text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-1.5 py-0.5 font-mono font-bold">LIVE</span>
        </div>

        {selectedMarker ? (
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedMarker.color }} />
              <span className="text-[10px] text-slate-500">{selectedMarker.type} · {selectedMarker.country}</span>
            </div>
            <h2 className="text-[15px] font-bold text-white leading-tight">{selectedMarker.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  color: STATUS_COLORS[selectedMarker.status] || '#94a3b8',
                  backgroundColor: `${STATUS_COLORS[selectedMarker.status] || '#94a3b8'}18`,
                  border: `1px solid ${STATUS_COLORS[selectedMarker.status] || '#94a3b8'}33`,
                }}
              >
                {selectedMarker.status.toUpperCase()}
              </span>
              <span className="text-[9px] text-slate-600">since {selectedMarker.yearAdded}</span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[13px] font-bold text-white leading-snug">
              One initiative, three continents, 140+ partners.
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Click a project on the map for details.
            </p>
          </div>
        )}
      </div>

      {/* SELECTED PROJECT DETAIL */}
      {selectedMarker && (
        <div className="px-4 py-3 border-b border-[#1a2235]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em]">Project Detail</span>
            <button
              onClick={onClearSelection}
              className="text-[9px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
            >
              ✕ clear
            </button>
          </div>
          <div className="space-y-2">
            <DetailRow label="Investment" value={selectedMarker.investment} highlight />
            <DetailRow label="Corridor" value={selectedMarker.corridor} color={selectedMarker.color} />
            <DetailRow label="Type" value={selectedMarker.type} />
            <DetailRow
              label="Coordinates"
              value={`${selectedMarker.lat.toFixed(2)}°, ${selectedMarker.lng.toFixed(2)}°`}
              mono
            />
          </div>
          <div className="mt-3 p-2.5 bg-[#111827] rounded-lg border border-[#1a2235]">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-slate-500">Corridor contribution</span>
              <span className="text-slate-400 font-mono font-medium">{selectedMarker.corridorId.toUpperCase()}</span>
            </div>
            <div className="h-1 bg-[#1a2235] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: '65%', backgroundColor: selectedMarker.color }}
              />
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO MIX */}
      <div className="px-4 py-3 border-b border-[#1a2235]">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em] block mb-3">Portfolio Mix</span>
        <div className="space-y-2.5">
          {PORTFOLIO_MIX.map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">{item.label}</span>
                <span className="text-[10px] font-mono text-slate-500 tabular-nums">{item.count}</span>
              </div>
              <div className="h-1.5 bg-[#111827] rounded-full overflow-hidden border border-[#1a2235]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(item.count / item.max) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LARGEST BY INVESTMENT */}
      <div className="px-4 py-3">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em] block mb-2.5">
          Largest by Investment
        </span>
        <div className="space-y-0">
          {TOP_PROJECTS.map((p, i) => {
            const statusColor = STATUS_COLORS[p.status] || '#94a3b8';
            return (
              <button
                key={p.name}
                className="w-full flex items-start gap-2 py-2 border-b border-[#1a2235] last:border-0 text-left hover:bg-white/[0.025] transition-colors rounded group"
              >
                <span className="text-[9px] text-slate-700 font-mono mt-0.5 flex-shrink-0 w-3.5 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-300 leading-snug truncate group-hover:text-white transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] font-bold text-slate-600 tracking-wide">{p.country}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-700" />
                    <span className="text-[8px] font-semibold" style={{ color: statusColor }}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300 flex-shrink-0 tabular-nums group-hover:text-white transition-colors">
                  {p.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  color,
  mono,
}: {
  label: string; value: string; highlight?: boolean; color?: string; mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-slate-600">{label}</span>
      <span
        className={`text-[11px] ${mono ? 'font-mono text-[10px]' : ''} ${highlight ? 'font-bold text-white' : 'font-medium text-slate-300'}`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
