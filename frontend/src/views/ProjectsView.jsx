import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  FolderPlus, 
  Layers, 
  ArrowUpRight, 
  X, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProjectsView() {
  const { projects, creations, createProject, setCurrentTab } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name.trim(), description.trim());
    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#12121b] border border-white/5 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-400" />
            <span>Creative Projects</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Group your generated images and videos into organized themed collections.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02]"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          // Count assets belonging to this project
          const projAssets = creations.filter((c) => c.projectId === proj.id);
          const coverImage = projAssets[0]?.url || proj.cover;

          return (
            <div
              key={proj.id}
              className="group rounded-2xl overflow-hidden bg-[#12121b] border border-white/5 hover:border-purple-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Cover Thumbnail */}
              <div className="relative h-44 overflow-hidden bg-black/60">
                <img
                  src={coverImage}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121b] via-transparent to-transparent opacity-90" />
                
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                  {projAssets.length} Assets
                </span>
              </div>

              {/* Project Details */}
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Local Collection
                  </span>
                  <button
                    onClick={() => setCurrentTab('gallery')}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Browse Gallery</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#12121b] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-purple-400" />
                <span>Create New Project Folder</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-zinc-400 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cyberpunk Character Series"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-zinc-400 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Notes, theme tags, target story, etc."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-semibold shadow-md shadow-purple-600/30 hover:scale-[1.02]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
