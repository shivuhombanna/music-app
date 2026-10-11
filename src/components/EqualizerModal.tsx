import React from 'react';
import { useMusic } from '../context/MusicContext';
import { X, Sliders, RotateCcw, Headphones } from 'lucide-react';
import { EqualizerSettings } from '../services/audioEngine';

const PRESETS: { name: string; eq: EqualizerSettings }[] = [
  { name: 'Flat', eq: { bass: 0, mid: 0, treble: 0 } },
  { name: 'Bass Boost', eq: { bass: 8, mid: 1, treble: -1 } },
  { name: 'Vocal Presence', eq: { bass: -2, mid: 6, treble: 3 } },
  { name: 'Electronic Club', eq: { bass: 7, mid: -2, treble: 5 } },
  { name: 'Acoustic Warmth', eq: { bass: 4, mid: 3, treble: 2 } },
  { name: 'Crisp Treble', eq: { bass: -3, mid: 1, treble: 8 } },
];

export const EqualizerModal: React.FC = () => {
  const {
    isEqModalOpen,
    setIsEqModalOpen,
    equalizer,
    updateEqualizer,
    spatialAudio,
    toggleSpatialAudio,
  } = useMusic();

  if (!isEqModalOpen) return null;

  const handleSliderChange = (band: keyof EqualizerSettings, val: number) => {
    updateEqualizer({
      ...equalizer,
      [band]: val,
    });
  };

  const handleReset = () => {
    updateEqualizer({ bass: 0, mid: 0, treble: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">Audio Equalizer & FX</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Reset to Flat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEqModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Acoustic Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => {
              const isMatch =
                equalizer.bass === p.eq.bass &&
                equalizer.mid === p.eq.mid &&
                equalizer.treble === p.eq.treble;

              return (
                <button
                  key={p.name}
                  onClick={() => updateEqualizer(p.eq)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    isMatch
                      ? 'bg-violet-600/20 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Band Equalizer Sliders */}
        <div className="grid grid-cols-3 gap-4 bg-slate-950/70 p-6 rounded-xl border border-slate-800/80">
          {/* Bass */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {equalizer.bass > 0 ? `+${equalizer.bass}` : equalizer.bass} dB
            </span>
            <input
              type="range"
              min={-12}
              max={12}
              step={1}
              value={equalizer.bass}
              onChange={(e) => handleSliderChange('bass', parseInt(e.target.value, 10))}
              className="h-32 accent-violet-500 [writing-mode:vertical-lr] [direction:rtl] cursor-pointer"
            />
            <div className="text-center">
              <span className="text-xs font-semibold text-white block">Bass</span>
              <span className="text-[10px] text-slate-500 font-mono">120 Hz</span>
            </div>
          </div>

          {/* Mid */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {equalizer.mid > 0 ? `+${equalizer.mid}` : equalizer.mid} dB
            </span>
            <input
              type="range"
              min={-12}
              max={12}
              step={1}
              value={equalizer.mid}
              onChange={(e) => handleSliderChange('mid', parseInt(e.target.value, 10))}
              className="h-32 accent-violet-500 [writing-mode:vertical-lr] [direction:rtl] cursor-pointer"
            />
            <div className="text-center">
              <span className="text-xs font-semibold text-white block">Mid</span>
              <span className="text-[10px] text-slate-500 font-mono">1.0 kHz</span>
            </div>
          </div>

          {/* Treble */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {equalizer.treble > 0 ? `+${equalizer.treble}` : equalizer.treble} dB
            </span>
            <input
              type="range"
              min={-12}
              max={12}
              step={1}
              value={equalizer.treble}
              onChange={(e) => handleSliderChange('treble', parseInt(e.target.value, 10))}
              className="h-32 accent-violet-500 [writing-mode:vertical-lr] [direction:rtl] cursor-pointer"
            />
            <div className="text-center">
              <span className="text-xs font-semibold text-white block">Treble</span>
              <span className="text-[10px] text-slate-500 font-mono">6.0 kHz</span>
            </div>
          </div>
        </div>

        {/* Spatial Audio Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Headphones className="w-4 h-4 text-violet-400" />
            <div>
              <p className="text-sm font-medium text-white">Spatial 3D Field</p>
              <p className="text-xs text-slate-400">Simulate wide stereo soundstage immersion</p>
            </div>
          </div>
          <button
            onClick={toggleSpatialAudio}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              spatialAudio ? 'bg-violet-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                spatialAudio ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
