'use client';

import { useState, useEffect, useRef } from 'react';

interface TimelineSliderProps {
  year: number;
  onYearChange: (y: number | ((prev: number) => number)) => void;
}

const MIN_YEAR = 2013;
const MAX_YEAR = 2026;
const GATE_YEARS = [2013, 2016, 2019, 2022, 2026];

export default function TimelineSlider({ year, onYearChange }: TimelineSliderProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        onYearChange((prev: number) => {
          if (prev >= MAX_YEAR) {
            setPlaying(false);
            return MAX_YEAR;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, onYearChange]);

  const pct = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="h-9 bg-[#0a0e1a] border-t border-[#1a2235] flex items-center gap-3 px-4 flex-shrink-0">
      {/* Play/Pause button */}
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-colors flex-shrink-0"
        title={playing ? 'Pause' : 'Play timeline'}
      >
        {playing ? (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Year display */}
      <span className="text-[14px] font-bold text-orange-400 font-mono tabular-nums flex-shrink-0 w-10 text-center">
        {year}
      </span>

      {/* Slider track + gate markers */}
      <div className="flex-1 relative" style={{ paddingBottom: '12px' }}>
        {/* Gate year tick marks */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ marginBottom: '12px' }}>
          {GATE_YEARS.map(gy => {
            const pos = ((gy - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
            return (
              <div
                key={gy}
                className="absolute -translate-x-1/2"
                style={{ left: `${pos}%`, top: '-8px' }}
              >
                <div
                  className="w-px h-3 mx-auto"
                  style={{ backgroundColor: gy <= year ? '#f97316' : '#1a2235' }}
                />
                <span
                  className="text-[7px] font-mono tabular-nums"
                  style={{ color: gy <= year ? '#6b7280' : '#374151' }}
                >
                  {gy}
                </span>
              </div>
            );
          })}
        </div>

        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={year}
          onChange={e => onYearChange(Number(e.target.value))}
          className="timeline-slider w-full"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${pct}%, #1a2235 ${pct}%, #1a2235 100%)`,
          }}
        />
      </div>

      {/* Info text */}
      <span className="text-[9px] text-slate-600 flex-shrink-0 font-mono">
        Showing projects by <span className="text-orange-500 font-bold">{year}</span>
      </span>
    </div>
  );
}
