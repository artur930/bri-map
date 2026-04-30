'use client';

interface StatsPanelProps {
  overview: {
    totalInvestmentBn: number;
    countriesInvolved: number;
    routesOperational: number;
    totalLengthKm: number;
  };
  regions: Array<{
    name: string;
    investmentBn: number;
    countries: number;
    color: string;
  }>;
}

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'T';
  return n.toFixed(0) + 'B';
}

export default function StatsPanel({ overview, regions }: StatsPanelProps) {
  return (
    <div
      className="absolute bottom-4 left-4 z-[500] w-56 rounded-2xl shadow-lg"
      style={{
        background: 'rgba(255, 252, 245, 0.96)',
        border: '1px solid rgba(210, 185, 150, 0.7)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid rgba(210, 185, 150, 0.5)' }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7c5c3e' }}>
          BRI Overview
        </h3>
      </div>

      {/* Stats grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2">
        <div
          className="rounded-xl p-2 text-center"
          style={{ background: 'rgba(232, 98, 42, 0.1)', border: '1px solid rgba(232, 98, 42, 0.2)' }}
        >
          <p className="text-base font-bold" style={{ color: '#e8622a' }}>
            ${formatNum(overview.totalInvestmentBn)}
          </p>
          <p className="text-xs" style={{ color: '#7c5c3e' }}>Investment</p>
        </div>
        <div
          className="rounded-xl p-2 text-center"
          style={{ background: 'rgba(3, 105, 161, 0.1)', border: '1px solid rgba(3, 105, 161, 0.2)' }}
        >
          <p className="text-base font-bold" style={{ color: '#0369a1' }}>
            {overview.countriesInvolved}
          </p>
          <p className="text-xs" style={{ color: '#7c5c3e' }}>Countries</p>
        </div>
        <div
          className="rounded-xl p-2 text-center"
          style={{ background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.2)' }}
        >
          <p className="text-base font-bold" style={{ color: '#16a34a' }}>
            {overview.routesOperational}
          </p>
          <p className="text-xs" style={{ color: '#7c5c3e' }}>Routes</p>
        </div>
        <div
          className="rounded-xl p-2 text-center"
          style={{ background: 'rgba(180, 83, 9, 0.1)', border: '1px solid rgba(180, 83, 9, 0.2)' }}
        >
          <p className="text-base font-bold" style={{ color: '#b45309' }}>
            {(overview.totalLengthKm / 1000).toFixed(0)}k
          </p>
          <p className="text-xs" style={{ color: '#7c5c3e' }}>km total</p>
        </div>
      </div>

      {/* Regional breakdown */}
      <div
        className="px-4 pb-3"
        style={{ borderTop: '1px solid rgba(210, 185, 150, 0.4)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mt-2 mb-2" style={{ color: '#9c7d5a' }}>
          By Region
        </p>
        {regions.map((region) => (
          <div key={region.name} className="mb-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs truncate" style={{ color: '#5c4030' }}>
                {region.name}
              </span>
              <span className="text-xs font-semibold" style={{ color: '#e8622a' }}>
                ${region.investmentBn}B
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(210, 185, 150, 0.3)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(region.investmentBn / overview.totalInvestmentBn) * 100}%`,
                  background: region.color || '#e8622a',
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
            }
