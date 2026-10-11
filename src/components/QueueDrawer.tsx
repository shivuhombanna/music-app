import React from 'react';
import { useMusic } from '../context/MusicContext';
import { X, Play, Trash2, ListMusic, History } from 'lucide-react';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    currentTrack,
    queue,
    history,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = useMusic();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0e1422] border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Playback Queue</h3>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium"
            >
              Clear Queue
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Currently Playing */}
        {currentTrack && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider block">
              Now Playing
            </span>
            <div className="p-3 bg-violet-950/30 border border-violet-800/40 rounded-xl flex items-center gap-3">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-cover border border-violet-700/50"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-slate-300 truncate">{currentTrack.artist}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-violet-300/80 font-mono">
                  <span>{currentTrack.genre}</span>
                  <span>·</span>
                  <span className="tabular-nums">{formatDuration(currentTrack.duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Up Next in Queue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Up Next ({queue.length})
            </span>
          </div>

          {queue.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">Queue is empty. Add songs to play next.</p>
          ) : (
            <div className="space-y-1">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-850 hover:bg-slate-800/50 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => playTrack(track)}
                  >
                    <div className="relative w-9 h-9 rounded-md overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-medium text-white truncate">{track.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      {formatDuration(track.duration)}
                    </span>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Played History */}
        {history.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <History className="w-3.5 h-3.5" />
              <span>Recently Played</span>
            </div>
            <div className="space-y-1">
              {history.slice(0, 5).map((track, idx) => (
                <div
                  key={`hist-${track.id}-${idx}`}
                  onClick={() => playTrack(track)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-medium text-slate-300 truncate">{track.title}</h5>
                    <p className="text-[11px] text-slate-500 truncate">{track.artist}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
