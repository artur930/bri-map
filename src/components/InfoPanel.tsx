'use client';

import { MapFeature } from '@/types';

interface InfoPanelProps {
  feature: MapFeature | null;
  onClose: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  port: '⚓',
  airport: '✈️',
  city: '🏙️',
};

const TYPE_COLORS: Record<string, string> = {
  port: '#0284c7',
  airport: '#7c3aed',
  city: '#e8622a',
};

export default function InfoPanel({ feature, onClose }: InfoPanelProps) {
  if (!feature) return null;

  const icon = TYPE_ICONS[feature.type] || '📍';
  const color = TYPE_COLORS[feature.type] || '#e8622a';

  return (
    <div
      className="absolute top-4 right-4 z-[500] w-72 rounded-2xl shadow-lg overflow-hidden"
      style={{
        background: 'rgba(255, 252, 245, 0.97)',
        border: '1px solid rgba(210, 185, 150, 0.7)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-start gap-3"
        style={{
          background: `${color}15`,
          borderBottom: '1px solid rgba(210, 185, 150, 0.5)',
        }}
      >
        <span className="text-2xl mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold truncate" style={{ color: '#3d2408' }}>
            {feature.name}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#7c5c3e' }}>
            {feature.country}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all mt-0.5 flex-shrink-0"
          style={{
            background: 'rgba(160, 120, 80, 0.2)',
            color: '#7c5c3e',
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{ background: `${color}20`, color: color }}
          >
            {feature.type}
          </span>
        </div>

        {feature.description && (
          <p className="text-xs leading-relaxed" style={{ color: '#5c4030' }}>
            {feature.description}
          </p>
        )}

        {feature.capacity && (
          <div
            className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: 'rgba(240, 230, 210, 0.6)' }}
          >
            <span className="text-xs" style={{ color: '#7c5c3e' }}>Capacity</span>
            <span className="text-xs font-semibold" style={{ color: '#3d2408' }}>
              {feature.capacity}
            </span>
          </div>
        )}

        {feature.investmentBn && (
          <div
            className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: 'rgba(240, 230, 210, 0.6)' }}
          >
            <span className="text-xs" style={{ color: '#7c5c3e' }}>BRI Investment</span>
            <span className="text-xs font-semibold" style={{ color: '#e8622a' }}>
              ${feature.investmentBn}B
            </span>
          </div>
        )}

        {feature.connectedRoutes && feature.connectedRoutes.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#7c5c3e' }}>
              Connected Routes
            </p>
            <div className="flex flex-wrap gap-1">
              {feature.connectedRoutes.map((route) => (
                <span
                  key={route}
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: 'rgba(232, 98, 42, 0.12)',
                    color: '#e8622a',
                    border: '1px solid rgba(232, 98, 42, 0.3)',
                  }}
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
            }
