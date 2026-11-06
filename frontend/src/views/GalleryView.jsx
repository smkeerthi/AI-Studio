import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Film, 
  Search, 
  Filter, 
  Heart, 
  Download, 
  Trash2, 
  Play, 
  Calendar, 
  FolderKanban, 
  ZoomIn,
  FolderPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GalleryView() {
  const { 
    creations, 
    projects, 
    setDetailItem, 
    deleteCreation, 
    toggleFavorite, 
    transferToVideo, 
    addToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'image' | 'video' | 'favorite'
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'

  // Filter & Search Logic
  const filteredCreations = useMemo(() => {
    return creations.filter((item) => {
      // Type filter
      if (activeFilter === 'image' && item.type !== 'image') return false;
      if (activeFilter === 'video' && item.type !== 'video') return false;
      if (activeFilter === 'favorite' && !item.favorite) return false;

      // Project filter
      if (selectedProjectFilter !== 'all' && item.projectId !== selectedProjectFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const promptMatch = item.prompt?.toLowerCase().includes(query);
        const styleMatch = item.style?.toLowerCase().includes(query);
        const modelMatch = item.model?.toLowerCase().includes(query);
        if (!titleMatch && !promptMatch && !styleMatch && !modelMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [creations, activeFilter, selectedProjectFilter, searchQuery, sortBy]);

  const handleDownload = (e, item) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.type === 'video' && item.videoUrl ? item.videoUrl : item.url;
    link.download = `${item.title.replace(/\s+/g, '_')}.${item.type === 'video' ? 'mp4' : 'png'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Download Started', `Downloading ${item.title}.`, 'success');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteCreation(id);
  };

  const handleFavorite = (e, id) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Controls Toolbar */}
      <div className="p-5 rounded-2xl bg-[#12121b] border border-white/5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, styles, keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Items', count: creations.length },
              { id: 'image', label: 'Images', count: creations.filter((c) => c.type === 'image').length },
              { id: 'video', label: 'Videos', count: creations.filter((c) => c.type === 'video').length },
              { id: 'favorite', label: 'Favorites', count: creations.filter((c) => c.favorite).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 rounded ${activeFilter === tab.id ? 'bg-purple-700' : 'bg-zinc-800'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Second Row: Project Filter & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 flex items-center gap-1">
              <FolderKanban className="w-3.5 h-3.5 text-zinc-400" /> Project:
            </span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Creations */}
      {filteredCreations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredCreations.map((item) => (
            <div
              key={item.id}
              onClick={() => setDetailItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDetailItem(item); }}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-purple-500/40 transition-all duration-300 cursor-pointer shadow-lg aspect-square flex flex-col justify-end"
            >
              {/* Image thumbnail / poster */}
              <img
                src={item.url}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-75 group-hover:opacity-95 transition-opacity" />

              {/* Top Badges & Actions */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                  {item.type === 'video' ? <Film className="w-3 h-3 text-indigo-400" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
                  {item.type === 'video' ? 'Video' : 'Image'}
                </span>

                <button
                  onClick={(e) => handleFavorite(e, item.id)}
                  className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                    item.favorite
                      ? 'bg-rose-500/80 text-white'
                      : 'bg-black/60 text-zinc-300 hover:text-white opacity-0 group-hover:opacity-100'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Video Play Overlay */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
              )}

              {/* Bottom Info & Quick Buttons */}
              <div className="relative z-10 p-3.5 space-y-1.5">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">{item.prompt}</p>

                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-zinc-400">
                  <span className="font-mono">{item.aspectRatio || '1:1'}</span>
                  
                  {/* Hover Action Buttons */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type === 'image' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          transferToVideo(item);
                        }}
                        className="p-1 rounded hover:bg-purple-600/40 text-purple-300 transition-colors"
                        title="Animate to Video"
                      >
                        <Film className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDownload(e, item)}
                      className="p-1 rounded hover:bg-white/20 text-zinc-200 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1 rounded hover:bg-rose-600/40 text-rose-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-[#12121b] border border-white/5 text-center space-y-3">
          <Filter className="w-10 h-10 mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white">No creations match your filter</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try resetting your search query or generate new artwork from the Text to Image or Image to Video studios.
          </p>
        </div>
      )}
    </div>
  );
}
