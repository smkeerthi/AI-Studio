import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Film, 
  Heart, 
  Copy, 
  Check, 
  FolderPlus, 
  Layers, 
  Sparkles,
  ExternalLink,
  Calendar,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AssetDetailModal() {
  const { 
    detailItem, 
    setDetailItem, 
    deleteCreation, 
    toggleFavorite, 
    transferToVideo, 
    projects, 
    assignToProject,
    addToast 
  } = useApp();

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [selectedProj, setSelectedProj] = useState(detailItem?.projectId || '');

  if (!detailItem) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    addToast('Copied to Clipboard', 'Prompt copied successfully.', 'info');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = detailItem.type === 'video' && detailItem.videoUrl ? detailItem.videoUrl : detailItem.url;
    link.download = `${detailItem.title.replace(/\s+/g, '_')}.${detailItem.type === 'video' ? 'mp4' : 'png'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Download Started', `Saving ${detailItem.title} to your computer.`, 'success');
  };

  const handleProjectChange = (e) => {
    const projId = e.target.value;
    setSelectedProj(projId);
    assignToProject(detailItem.id, projId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#101017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setDetailItem(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Preview Stage (Left / Top) */}
        <div className="lg:w-3/5 bg-black/90 flex items-center justify-center p-4 relative group min-h-[340px] max-h-[60vh] lg:max-h-[92vh]">
          {detailItem.type === 'video' ? (
            <video
              src={detailItem.videoUrl || detailItem.url}
              poster={detailItem.url}
              controls
              autoPlay
              loop
              className="max-h-[550px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          ) : (
            <img
              src={detailItem.url}
              alt={detailItem.title}
              className="max-h-[550px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          )}

          {/* Media type badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              {detailItem.type === 'video' ? <Film className="w-3 h-3 text-purple-400" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
              {detailItem.type === 'video' ? 'AI Video (MP4)' : 'AI Image (PNG)'}
            </span>
          </div>
        </div>

        {/* Details & Controls Sidebar (Right) */}
        <div className="lg:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[60vh] lg:max-h-[92vh] border-t lg:border-t-0 lg:border-l border-white/10 bg-[#12121b]">
          <div className="space-y-5">
            {/* Title & Favorite */}
            <div className="flex items-start justify-between gap-3 pr-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {detailItem.title || 'Untitled Creation'}
                </h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {new Date(detailItem.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <button
                onClick={() => toggleFavorite(detailItem.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  detailItem.favorite
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-zinc-800/60 border-white/5 text-zinc-400 hover:text-white'
                }`}
                title="Toggle Favorite"
              >
                <Heart className={`w-4 h-4 ${detailItem.favorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Prompt details */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span>Prompt</span>
                <button
                  onClick={() => copyToClipboard(detailItem.prompt)}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 lowercase text-xs"
                >
                  {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'copied' : 'copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 text-xs text-zinc-200 leading-relaxed font-sans select-text max-h-28 overflow-y-auto">
                {detailItem.prompt}
              </div>
            </div>

            {/* Motion Prompt (for video) */}
            {detailItem.type === 'video' && detailItem.motionPrompt && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <Film className="w-3 h-3" /> Motion Animation Prompt
                </span>
                <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                  {detailItem.motionPrompt}
                </div>
              </div>
            )}

            {/* Negative Prompt */}
            {detailItem.negativePrompt && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Negative Prompt</span>
                <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/5 text-[11px] text-zinc-400 select-text">
                  {detailItem.negativePrompt}
                </div>
              </div>
            )}

            {/* Technical Parameters Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">Engine & Model</span>
                <span className="font-medium text-zinc-200 truncate block mt-0.5" title={detailItem.engine}>
                  {detailItem.model || 'SDXL / Wan 2.1'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">Dimensions</span>
                <span className="font-medium text-zinc-200 block mt-0.5 font-mono">
                  {detailItem.width || 1024} × {detailItem.height || 1024} ({detailItem.aspectRatio || '1:1'})
                </span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">Style Preset</span>
                <span className="font-medium text-zinc-200 block mt-0.5">
                  {detailItem.style || 'Cinematic'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">Seed</span>
                <span className="font-medium text-zinc-200 block mt-0.5 font-mono">
                  {detailItem.seed || 1234567}
                </span>
              </div>
            </div>

            {/* Assign Project Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus className="w-3.5 h-3.5 text-zinc-400" />
                <span>Assign to Project</span>
              </label>
              <select
                value={selectedProj}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="">No Project (Standalone)</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 space-y-2 mt-4">
            {/* If it's an image, offer instant "Animate to Video" */}
            {detailItem.type === 'image' && (
              <button
                onClick={() => {
                  setDetailItem(null);
                  transferToVideo(detailItem);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
              >
                <Film className="w-4 h-4 text-purple-200" />
                <span>Animate this Image (Wan 2.1 Video)</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                onClick={() => deleteCreation(detailItem.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-medium transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
