'use client';

import { useState, useEffect, useRef } from 'react';

interface TimelineSliderProps {
  year: number;
  onYearChange: (y: number | ((prev: number) => number)) => void;
}

const MIN_YEAR = 2013;
const MAX_YEAR = 2026;

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
      }, 800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, onYearChange]);

  const pct = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="h-9 bg-[#0a0e1a] border-t border-[#1a2235] flex items-center gap-4 px-4 flex-shrink-0">
      {/* Play button */}
      <button
        onClick={() => setPlaying(p => !p)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-colors flex-shrink-0"
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
      <div className="w-12 text-center flex-shrink-0">
        <span className="text-[13px] font-bold text-orange-400 font-mono tabular-nums">{year}</span>
      </div>

      {/* Slider track */}
      <div className="flex-1 relative flex items-center gap-1">
        {/* Year ticks */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i).map(y => (
            <div
              key={y}
              className={`w-px transition-all ${
                y <= year ? 'bg-orange-500/60' : 'bg-[#1a2235]'
              } ${y % 2 === 0 ? 'h-2.5' : 'h-1.5'}`}
            />
          ))}
        </div>

        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={year}
          onChange={e => onYearChange(Number(e.target.value))}
          className="timeline-slider w-full"
        />
      </div>

      {/* Year labels */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-[9px] text-slate-600 font-mono">{MIN_YEAR}</span>
        <span className="text-[9px] text-slate-600 font-mono">→</span>
        <span className="text-[9px] text-slate-600 font-mono">{MAX_YEAR}</span>
      </div>

      <div className="text-[9px] text-slate-600 flex-shrink-0">
        Showing projects added by <span className="text-orange-400 font-mono font-bold">{year}</span>
      </div>
    </div>
  );
}
