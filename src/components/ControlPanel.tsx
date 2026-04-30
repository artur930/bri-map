'use client';

import { LayerVisibility } from '@/types';

interface ControlPanelProps {
  layers: LayerVisibility;
  onToggle: (key: keyof LayerVisibility) => void;
  onResetView: () => void;
}

const LAYER_LABELS: Record<keyof LayerVisibility, { label: string; emoji: string; color: string }> = {
  maritime: { label: 'Maritime Routes', emoji: '⛵', color: '#0369a1' },
  land: { label: 'Land Routes', emoji: '🚂', color: '#b45309' },
  ports: { label: 'Ports', emoji: '⚓', color: '#0284c7' },
  airports: { label: 'Airports', emoji: '✈️', color: '#7c3aed' },
  cities: { label: 'Cities', emoji: '🏙️', color: '#e8622a' },
};

export default function ControlPanel({ layers, onToggle, onResetView }: ControlPanelProps) {
  return (
    <div
      className="absolute top-4 left-4 z-[500] w-56 rounded-2xl shadow-lg"
      style={{
        background: 'rgba(255, 252, 245, 0.96)',
        border: '1px solid rgba(210, 185, 150, 0.7)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 rounded-t-2xl"
        style={{ borderBottom: '1px solid rgba(210, 185, 150, 0.5)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <div>
            <h1 className="text-sm font-bold" style={{ color: '#3d2408' }}>Belt & Road</h1>
            <p className="text-xs" style={{ color: '#7c5c3e' }}>Initiative Map</p>
          </div>
        </div>
      </div>

      {/* Layer toggles */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9c7d5a' }}>
          Layers
        </p>
        {(Object.entries(LAYER_LABELS) as [keyof LayerVisibility, typeof LAYER_LABELS[keyof LayerVisibility]][]).map(
          ([key, { label, emoji, color }]) => (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: layers[key]
                  ? `${color}18`
                  : 'rgba(240, 230, 210, 0.5)',
                border: `1px solid ${layers[key] ? color + '40' : 'rgba(210, 185, 150, 0.4)'}`,
                color: layers[key] ? color : '#9c7d5a',
                opacity: layers[key] ? 1 : 0.6,
              }}
            >
              <span>{emoji}</span>
              <span className="flex-1 text-left">{label}</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: layers[key] ? color : 'rgba(160, 130, 100, 0.4)' }}
              />
            </button>
          )
        )}
      </div>

      {/* Reset button */}
      <div className="px-4 pb-3">
        <button
          onClick={onResetView}
          className="w-full py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, #e8622a 0%, #f59e0b 100%)',
            color: 'white',
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
                                     }
