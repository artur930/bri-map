'use client';

import { LayerVisibility } from '@/types';

interface ControlPanelProps {
  layers: LayerVisibility;
  onToggle: (key: keyof LayerVisibility) => void;
  onResetView: () => void;
}

interface ToggleItem {
  key: keyof LayerVisibility;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const ROUTE_LAYERS: ToggleItem[] = [
  {
    key: 'maritime',
    label: 'Maritime Routes',
    icon: '🌊',
    color: '#0ea5e9',
    description: 'Sea shipping corridors',
  },
  {
    key: 'land',
    label: 'Land Corridors',
    icon: '🛤️',
    color: '#f59e0b',
    description: 'Rail & road networks',
  },
];

const MARKER_LAYERS: ToggleItem[] = [
  {
    key: 'ports',
    label: 'Ports',
    icon: '⚓',
    color: '#0ea5e9',
    description: 'Major maritime ports',
  },
  {
    key: 'airports',
    label: 'Airports',
    icon: '✈',
    color: '#8b5cf6',
    description: 'Key air cargo hubs',
  },
  {
    key: 'cities',
    label: 'City Hubs',
    icon: '🏙',
    color: '#f59e0b',
    description: 'Strategic BRI cities',
  },
];

function LayerToggle({
  item,
  active,
  onToggle,
}: {
  item: ToggleItem;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 text-left group ${
        active
          ? 'bg-slate-700/70 border-slate-600/60 text-white'
          : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-300 hover:bg-slate-700/40'
      }`}
    >
      <span className="text-base w-6 text-center">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight truncate">{item.label}</p>
        <p className="text-xs text-slate-500 leading-tight truncate">{item.description}</p>
      </div>
      <div
        className={`w-8 h-4.5 rounded-full flex items-center transition-all duration-200 flex-shrink-0 ${
          active ? 'justify-end bg-sky-500/30' : 'justify-start bg-slate-700'
        }`}
        style={{ height: '18px', minWidth: '32px' }}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full mx-0.5 transition-all duration-200 ${
            active ? 'bg-sky-400' : 'bg-slate-500'
          }`}
        />
      </div>
    </button>
  );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-3 w-8 flex-shrink-0">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-full h-0.5 rounded"
          style={{
            backgroundColor: color,
            backgroundImage: dashed
              ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 5px, transparent 5px, transparent 9px)`
              : undefined,
          }}
        />
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

export default function ControlPanel({ layers, onToggle, onResetView }: ControlPanelProps) {
  return (
    <div className="absolute top-4 left-4 z-[500] w-60 flex flex-col gap-3">
      {/* Title card */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">Live Map</span>
        </div>
        <h1 className="text-base font-bold text-white leading-tight">Belt & Road Initiative</h1>
        <p className="text-xs text-slate-400 mt-0.5">Interactive Infrastructure Map</p>
      </div>

      {/* Layer controls */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Routes</p>
        <div className="space-y-1.5">
          {ROUTE_LAYERS.map((item) => (
            <LayerToggle
              key={item.key}
              item={item}
              active={layers[item.key]}
              onToggle={() => onToggle(item.key)}
            />
          ))}
        </div>

        <div className="h-px bg-slate-700/50 my-3" />

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Markers</p>
        <div className="space-y-1.5">
          {MARKER_LAYERS.map((item) => (
            <LayerToggle
              key={item.key}
              item={item}
              active={layers[item.key]}
              onToggle={() => onToggle(item.key)}
            />
          ))}
        </div>
      </div>

      {/* Route legend */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Route Status</p>
        <div className="space-y-1.5 px-1">
          <LegendItem color="#22c55e" label="Operational" />
          <LegendItem color="#f59e0b" label="Under Construction" dashed />
          <LegendItem color="#94a3b8" label="Planned" dashed />
        </div>
      </div>

      {/* Reset view button */}
      <button
        onClick={onResetView}
        className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/95 hover:border-slate-600 transition-all shadow-xl text-left flex items-center gap-2"
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
        Reset View
      </button>
    </div>
  );
}
