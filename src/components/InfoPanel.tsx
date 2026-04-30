'use client';

import { MapFeature, Port, Airport, City } from '@/types';

interface InfoPanelProps {
  feature: MapFeature | null;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  operational: 'text-green-400 bg-green-400/10',
  under_construction: 'text-amber-400 bg-amber-400/10',
  planned: 'text-slate-400 bg-slate-400/10',
};

const STATUS_DOTS: Record<string, string> = {
  operational: 'bg-green-400',
  under_construction: 'bg-amber-400',
  planned: 'bg-slate-400',
};

function PortDetails({ port }: { port: Port }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Annual Capacity" value={`${(port.capacity / 1_000_000).toFixed(1)}M`} unit={port.capacityUnit.replace('/year', '/yr')} />
        <StatCard label="Investment" value={`$${port.investment.toLocaleString()}`} unit={port.investmentUnit} />
        <StatCard label="Established" value={String(port.completionYear)} unit="year" />
        <StatCard label="Region" value={port.region} unit="" />
      </div>

      <Section title="Facilities">
        <div className="flex flex-wrap gap-1.5">
          {port.facilities.map((f) => (
            <Tag key={f} label={f} color="blue" />
          ))}
        </div>
      </Section>

      <Section title="Key Trade Partners">
        <div className="flex flex-wrap gap-1.5">
          {port.tradePartners.map((p) => (
            <Tag key={p} label={p} color="purple" />
          ))}
        </div>
      </Section>
    </>
  );
}

function AirportDetails({ airport }: { airport: Airport }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Cargo" value={`${(airport.cargoCapacity / 1_000_000).toFixed(2)}M`} unit={airport.cargoUnit.replace('/year', '/yr')} />
        <StatCard label="Passengers" value={`${(airport.passengerCapacity / 1_000_000).toFixed(0)}M`} unit="pax/yr" />
        <StatCard label="IATA Code" value={airport.iata} unit="" />
        <StatCard label="Investment" value={`$${airport.investment.toLocaleString()}`} unit={airport.investmentUnit} />
      </div>

      <Section title="Key Routes">
        <div className="flex flex-wrap gap-1.5">
          {airport.routes.map((r) => (
            <Tag key={r} label={r} color="purple" />
          ))}
        </div>
      </Section>
    </>
  );
}

function CityDetails({ city }: { city: City }) {
  return (
    <>
      <div className="mb-3">
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {city.briRole}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Population" value={`${(city.population / 1_000_000).toFixed(1)}M`} unit="people" />
        <StatCard label="GDP" value={`$${(city.gdp / 1000).toFixed(0)}B`} unit={city.gdpUnit.replace('million USD', 'USD')} />
        <StatCard label="Region" value={city.region} unit="" />
      </div>

      <Section title="Key BRI Projects">
        <ul className="space-y-1">
          {city.keyProjects.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-amber-400 mt-0.5">▸</span>
              {p}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-base font-bold text-white leading-tight">{value}</p>
      {unit && <p className="text-xs text-slate-400">{unit}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
}

function Tag({ label, color }: { label: string; color: 'blue' | 'purple' | 'green' }) {
  const colors = {
    blue: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
    purple: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${colors[color]}`}>
      {label}
    </span>
  );
}

const TYPE_ICONS: Record<string, string> = {
  port: '⚓',
  airport: '✈',
  city: '🏙',
};

const TYPE_LABELS: Record<string, string> = {
  port: 'Maritime Port',
  airport: 'International Airport',
  city: 'BRI City Hub',
};

export default function InfoPanel({ feature, onClose }: InfoPanelProps) {
  if (!feature) return null;

  const statusKey = 'status' in feature ? (feature as Port | Airport).status : 'operational';

  return (
    <div className="absolute top-4 right-4 z-[500] w-80 max-h-[calc(100vh-2rem)] flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{TYPE_ICONS[feature.type]}</span>
            <span className="text-xs font-medium text-slate-400">{TYPE_LABELS[feature.type]}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">{feature.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{feature.country}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0"
          aria-label="Close panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Status badge */}
      {'status' in feature && (
        <div className="px-4 pt-3 pb-0">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[statusKey]} border-current/20`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[statusKey]}`} />
            {statusKey.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>
      )}

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{feature.description}</p>

        {feature.type === 'port' && <PortDetails port={feature as Port} />}
        {feature.type === 'airport' && <AirportDetails airport={feature as Airport} />}
        {feature.type === 'city' && <CityDetails city={feature as City} />}
      </div>

      {/* Coordinates footer */}
      <div className="px-4 py-2.5 border-t border-slate-700/50 bg-slate-800/30">
        <p className="text-xs text-slate-500 font-mono">
          {feature.lat.toFixed(4)}°, {feature.lng.toFixed(4)}°
        </p>
      </div>
    </div>
  );
}
