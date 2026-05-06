'use client';

import { useState } from 'react';

interface TweaksPanelProps {
  animatedFlows: boolean;
  showLabels: boolean;
  density: 'all' | 'major';
  onToggleAnimated: () => void;
  onToggleLabels: () => void;
  onSetDensity: (d: 'all' | 'major') => void;
}

export default function TweaksPanel({
  animatedFlows,
  showLabels,
  density,
  onToggleAnimated,
  onToggleLabels,
  onSetDensity,
}: TweaksPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all border ${
          open
            ? 'bg-[#1e2a3a] border-[#2d4060] text-slate-200'
            : 'bg-[#111827] border-[#1a2235] text-slate-500 hover:text-slate-300 hover:border-[#2d3f5a]'
        }`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        TWEAKS
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute bottom-full right-0 mb-2 w-56 bg-[#111827] border border-[#1e2a3a] rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#1a2235]">
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">Tweaks</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-600 hover:text-slate-400 text-sm leading-none"
              >
                ✕
              </button>
            </div>

            {/* Toggles */}
            <div className="px-3 py-2">
              <IOSToggle
                label="Animated flows"
                description="Animate dashes on maritime route"
                checked={animatedFlows}
                onToggle={onToggleAnimated}
              />
              <IOSToggle
                label="Labels on large projects"
                description="Show year added in popups"
                checked={showLabels}
                onToggle={onToggleLabels}
              />
            </div>

            {/* Density */}
            <div className="px-3 pt-1 pb-3 border-t border-[#1a2235]">
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2 mt-1.5">Density</p>
              <div className="flex gap-1">
                {(['all', 'major'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => onSetDensity(d)}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                      density === d
                        ? 'bg-[#1a2235] text-orange-400 border border-orange-500/30'
                        : 'bg-transparent text-slate-600 border border-[#1a2235] hover:text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function IOSToggle({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1a2235] last:border-0">
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-[11px] font-medium text-slate-300 leading-tight">{label}</p>
        <p className="text-[9px] text-slate-600 leading-tight mt-0.5">{description}</p>
      </div>
      {/* iOS-style toggle */}
      <button
        onClick={onToggle}
        className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? 'bg-orange-500' : 'bg-[#2d3f5a]'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
