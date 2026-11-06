import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  FolderKanban, 
  Settings2, 
  Cpu, 
  CloudLightning,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentTab, setCurrentTab, engineMode, hardware, backendStatus, colabStatus } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'txt2img', label: 'Text to Image', icon: Sparkles, badge: 'SD / FLUX' },
    { id: 'img2vid', label: 'Image to Video', icon: Film, badge: 'Wan 2.1' },
    { id: 'gallery', label: 'My Gallery', icon: ImageIcon },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0d0d12]/95 border-r border-white/5 flex flex-col justify-between select-none fixed top-0 left-0 z-40 backdrop-blur-xl">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-500 to-indigo-500 shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
              <div className="absolute -inset-0.5 rounded-xl bg-purple-500/20 blur-sm -z-10" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                AI Studio
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Free
                </span>
              </h1>
              <p className="text-xs text-zinc-400">Creative Generation Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Studio Workspaces
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/25 to-violet-600/10 text-white border border-purple-500/40 shadow-sm shadow-purple-500/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-purple-400' : 'text-zinc-400 group-hover:text-zinc-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hardware & Generation Engine Status Footer */}
      <div className="p-3 border-t border-white/5 space-y-2 bg-[#09090c]/70">
        {/* Engine mode pill */}
        <div 
          onClick={() => setCurrentTab('settings')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentTab('settings'); }}
          className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <CloudLightning className="w-3.5 h-3.5 text-purple-400" />
              Engine Mode
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                engineMode === 'colab'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-700/50'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
              }`}
            >
              {engineMode === 'colab' ? 'Remote GPU' : 'Local Safe'}
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>
              {engineMode === 'colab' ? 'Google Colab T4' : 'GT 630M (Safe)'}
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
          </div>
        </div>

        {/* Hardware Guard Tag */}
        <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-white/[0.04] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>2GB VRAM Guard</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">
            Active
          </span>
        </div>

        {/* Backend Connectivity Status */}
        <div className="px-2.5 py-1 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendStatus === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
              }`}
            />
            {backendStatus === 'online' ? 'Backend Live' : 'Local Standalone'}
          </span>
          <span className="font-mono text-zinc-400">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
