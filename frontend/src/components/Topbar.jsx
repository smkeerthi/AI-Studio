import React from 'react';
import { Sparkles, Film, HardDrive, Cpu, Cloud, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Topbar() {
  const { currentTab, setCurrentTab, engineMode, setEngineMode, colabStatus, hardware } = useApp();

  const titles = {
    dashboard: { title: 'Studio Overview', subtitle: 'Personal AI Creative Workspace' },
    txt2img: { title: 'Text to Image Generator', subtitle: 'Synthesize high-fidelity visuals with SDXL & FLUX' },
    img2vid: { title: 'Image to Video Generator', subtitle: 'Cinematic motion animation powered by Wan 2.1' },
    gallery: { title: 'Local Media Gallery', subtitle: 'Organize and export your generated collection' },
    projects: { title: 'Projects & Collections', subtitle: 'Curate thematic artworks, assets and clips' },
    settings: { title: 'Studio Preferences', subtitle: 'Runtime connections, hardware guards and storage' }
  };

  const current = titles[currentTab] || { title: 'AI Creative Studio', subtitle: '' };

  return (
    <header className="h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Title & Path */}
      <div>
        <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          {current.title}
        </h2>
        <p className="text-xs text-zinc-400 hidden sm:block">
          {current.subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Storage footprint badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-white/5 text-xs text-zinc-300">
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span>Local Disk:</span>
          <span className="font-mono text-white font-medium">315 GB Free</span>
        </div>

        {/* Engine switcher quick toggle */}
        <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setEngineMode('colab')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              engineMode === 'colab'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cloud className="w-3 h-3" />
            <span>Colab T4 (16GB)</span>
          </button>
          <button
            onClick={() => setEngineMode('local')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              engineMode === 'local'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Local Safe (2GB)</span>
          </button>
        </div>

        {/* Quick Launch Buttons */}
        {currentTab !== 'txt2img' && (
          <button
            onClick={() => setCurrentTab('txt2img')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Image</span>
          </button>
        )}

        {currentTab !== 'img2vid' && (
          <button
            onClick={() => setCurrentTab('img2vid')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-purple-200 border border-purple-500/20 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Animate Video</span>
          </button>
        )}
      </div>
    </header>
  );
}
