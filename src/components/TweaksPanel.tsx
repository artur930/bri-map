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
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
          open
            ? 'bg-[#1a2235] border-[#2d3f5a] text-slate-200'
            : 'bg-[#0d111c] border-[#1a2235] text-slate-400 hover:text-slate-300 hover:border-[#2d3f5a]'
        }`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        TWEAKS
        <svg
          className={`w-2.5 h-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-1.5 w-52 bg-[#111827] border border-[#1a2235] rounded-xl shadow-2xl p-3 z-50">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-2.5">Display Settings</p>

          <Toggle
            label="Animated flows"
            description="Animate dashes along maritime route"
            checked={animatedFlows}
            onToggle={onToggleAnimated}
          />
          <Toggle
            label="Labels on large projects"
            description="Show year labels in popups"
            checked={showLabels}
            onToggle={onToggleLabels}
          />

          <div className="mt-3 pt-2.5 border-t border-[#1a2235]">
            <p className="text-[9px] text-slate-500 mb-1.5">Density</p>
            <div className="flex gap-1">
              {(['all', 'major'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => onSetDensity(d)}
                  className={`flex-1 py-1 rounded text-[10px] font-medium transition-colors ${
                    density === d
                      ? 'bg-[#f97316]/20 text-orange-400 border border-[#f97316]/30'
                      : 'bg-[#1a2235] text-slate-500 border border-transparent hover:text-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ label, description, checked, onToggle }: {
  label: string; description: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-2.5 py-2 text-left group"
    >
      <div className={`relative mt-0.5 w-8 h-4 rounded-full flex items-center flex-shrink-0 transition-colors ${checked ? 'bg-orange-500/30' : 'bg-[#1a2235]'}`}>
        <div
          className={`absolute w-3 h-3 rounded-full transition-all ${checked ? 'left-4 bg-orange-400' : 'left-0.5 bg-slate-600'}`}
        />
      </div>
      <div>
        <p className="text-[11px] text-slate-300 font-medium leading-tight">{label}</p>
        <p className="text-[9px] text-slate-600 leading-tight mt-0.5">{description}</p>
      </div>
    </button>
  );
}
