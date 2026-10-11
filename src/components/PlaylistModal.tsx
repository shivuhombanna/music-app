import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { X, FolderPlus } from 'lucide-react';

export const PlaylistModal: React.FC = () => {
  const {
    isCreatePlaylistOpen,
    setIsCreatePlaylistOpen,
    createPlaylist,
    setSelectedPlaylistId,
    setActiveView,
  } = useMusic();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = createPlaylist(name.trim(), description.trim());
    setSelectedPlaylistId(newId);
    setActiveView('playlist');
    setName('');
    setDescription('');
    setIsCreatePlaylistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <FolderPlus className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">Create New Playlist</h3>
          </div>
          <button
            onClick={() => setIsCreatePlaylistOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Playlist Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Late Night Focus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Give your playlist a vibe or theme..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatePlaylistOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg shadow-sm transition-colors"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
