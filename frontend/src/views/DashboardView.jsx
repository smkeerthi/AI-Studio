import React from 'react';
import { 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  FolderKanban, 
  CloudLightning, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  Play, 
  Clock, 
  HardDrive,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardView() {
  const { 
    setCurrentTab, 
    creations, 
    projects, 
    engineMode, 
    setEngineMode, 
    hardware, 
    setDetailItem,
    transferToVideo 
  } = useApp();

  const totalImages = creations.filter((c) => c.type === 'image').length;
  const totalVideos = creations.filter((c) => c.type === 'video').length;
  const recentItems = creations.slice(0, 4);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-8 overflow-hidden border border-purple-500/20 bg-gradient-to-br from-[#171329] via-[#0f0e1a] to-[#09090e] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Zero-Subscription AI Generative Studio</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Bring Your Imagination to Life in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300">
                Stunning Visuals & Motion
              </span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Generate photorealistic images and cinematic animated videos locally or via free Google Colab GPU compute. Designed specifically for your 8 GB RAM and 2 GB VRAM hardware with zero paid API lock-in.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('txt2img')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Text to Image Studio</span>
              </button>

              <button
                onClick={() => setCurrentTab('img2vid')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 text-purple-200 border border-purple-500/20 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Film className="w-4 h-4 text-purple-400" />
                <span>Image to Video Animator</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill Panel */}
          <div className="grid grid-cols-2 gap-3 lg:w-72">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>Generated Images</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">{totalImages}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Film className="w-4 h-4 text-indigo-400" />
                <span>Animated Videos</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">{totalVideos}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <FolderKanban className="w-4 h-4 text-violet-400" />
                <span>Projects</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">{projects.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Local Storage</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">315 GB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Engine & Hardware Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engine Status Card */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <CloudLightning className="w-4 h-4 text-purple-400" />
                Generation Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {engineMode === 'colab' ? 'Free Cloud GPU' : 'Local Engine'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {engineMode === 'colab' ? 'Google Colab T4 (16GB VRAM)' : 'Local Safe Mode (2GB VRAM)'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {engineMode === 'colab'
                ? 'Runs SDXL, FLUX, and Wan 2.1 video models in free Google Colab sessions and streams results directly into your local folders.'
                : 'Optimized for lightweight CPU and small-footprint models. Heavy models are blocked to prevent 2GB GPU crashes.'}
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setCurrentTab('settings')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Manage Engine & Runtime</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hardware Guard Card */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Hardware Guard
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Safe
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">GeForce GT 630M (2 GB)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              System RAM: 8.0 GB DDR3. Local safety checks prevent your legacy graphics card from overheating or running out of memory.
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
            <span>OOM Protection: Enabled</span>
            <span className="font-mono text-emerald-400">Protected</span>
          </div>
        </div>

        {/* Local Folder Storage */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                Local Storage Folders
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-zinc-800 text-zinc-300">
                Indexed
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Direct Local Savings</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generations are written to <code className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded text-[11px]">storage/images</code> and <code className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded text-[11px]">storage/videos</code> on your PC. No third-party clouds keep your creations.
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setCurrentTab('gallery')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore My Gallery</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text to Image Launchpad */}
        <div 
          onClick={() => setCurrentTab('txt2img')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentTab('txt2img'); }}
          className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#13111f] to-[#0c0c12] border border-white/5 hover:border-purple-500/40 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between min-h-[260px]"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Text to Image Generation
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SDXL / FLUX
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Transform detailed text descriptions into stunning 8k imagery across 8 visual styles including Realistic, Anime, 3D, and Cinematic. Supports custom aspect ratios and seed control.
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
            <span>Open Image Studio</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>

        {/* Image to Video Launchpad */}
        <div 
          onClick={() => setCurrentTab('img2vid')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentTab('img2vid'); }}
          className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#121324] to-[#0c0c12] border border-white/5 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between min-h-[260px]"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Image to Video Generation
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Wan 2.1
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Bring static photos or generated artwork to life with natural character movement, eye blinks, gentle hair physics, and cinematic camera orbits using open-weight video models.
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>Open Video Animator</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Recent Creations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent Creations
            </h3>
            <p className="text-xs text-zinc-400">Directly from your local studio collection</p>
          </div>
          <button
            onClick={() => setCurrentTab('gallery')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <span>View All ({creations.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentItems.map((item) => (
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

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Type Badge Top Left */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                  {item.type === 'video' ? <Film className="w-3 h-3 text-indigo-400" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
                  {item.type === 'video' ? 'Video' : 'Image'}
                </span>
              </div>

              {/* Play icon for video */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </div>
              )}

              {/* Info Bottom */}
              <div className="relative z-10 p-3 space-y-1">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[11px] text-zinc-300 line-clamp-1">{item.prompt}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 font-mono">
                  <span>{item.style}</span>
                  <span>{item.aspectRatio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
