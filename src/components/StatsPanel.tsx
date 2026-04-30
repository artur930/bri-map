'use client';

import { useState } from 'react';
import { OverviewStats, RegionStats } from '@/types';

interface StatsPanelProps {
  overview: OverviewStats;
  regions: RegionStats[];
}

function OverviewCard({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: string }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40 flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-slate-400 leading-tight">{label}</p>
        <p className="text-base font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-slate-500">{unit}</p>
      </div>
    </div>
  );
}

function RegionBar({ region, maxInvestment }: { region: RegionStats; maxInvestment: number }) {
  const pct = (region.investment / maxInvestment) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-slate-300">{region.name}</span>
        <span className="text-xs text-slate-400">${region.investment}B · {region.countries} nations</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: region.color }}
        />
      </div>
      <div className="flex gap-3 text-xs text-slate-500">
        <span>⚓ {region.stats.ports} ports</span>
        <span>✈ {region.stats.airports} airports</span>
        <span>🚆 {region.stats.railways} rail</span>
      </div>
    </div>
  );
}

export default function StatsPanel({ overview, regions }: StatsPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const maxInvestment = Math.max(...regions.map((r) => r.investment));

  return (
    <div className="absolute bottom-8 left-4 z-[500] w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📊</span>
          <span className="text-sm font-semibold text-white">BRI Statistics</span>
          <span className="text-xs text-slate-500">({overview.lastUpdated})</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-700/40 pt-3">
          {/* Overview grid */}
          <div className="grid grid-cols-2 gap-2">
            <OverviewCard
              label="Total Investment"
              value={`$${overview.totalInvestment}B+`}
              unit="USD committed"
              icon="💰"
            />
            <OverviewCard
              label="Partner Nations"
              value={String(overview.participatingCountries)}
              unit="countries signed"
              icon="🌐"
            />
            <OverviewCard
              label="Trade Volume"
              value={`$${overview.tradeVolume}B`}
              unit="annual USD"
              icon="📦"
            />
            <OverviewCard
              label="Jobs Created"
              value={`${(overview.jobsCreated / 1000).toFixed(0)}K+`}
              unit="direct jobs"
              icon="👷"
            />
          </div>

          {/* Ongoing vs Completed */}
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30">
            <p className="text-xs text-slate-500 mb-2">Project Status</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(overview.projectsCompleted / (overview.projectsCompleted + overview.projectsOngoing)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span className="text-green-400">✓ {overview.projectsCompleted.toLocaleString()} completed</span>
              <span className="text-amber-400">⚙ {overview.projectsOngoing.toLocaleString()} ongoing</span>
            </div>
          </div>

          {/* Regional breakdown */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Regional Investment</p>
            <div className="space-y-3">
              {regions.map((region) => (
                <RegionBar key={region.name} region={region} maxInvestment={maxInvestment} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
