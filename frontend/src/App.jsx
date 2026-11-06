import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import AssetDetailModal from './components/AssetDetailModal';

// Views
import DashboardView from './views/DashboardView';
import TextToImageView from './views/TextToImageView';
import ImageToVideoView from './views/ImageToVideoView';
import GalleryView from './views/GalleryView';
import ProjectsView from './views/ProjectsView';
import SettingsView from './views/SettingsView';

export default function App() {
  const { currentTab } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'txt2img':
        return <TextToImageView />;
      case 'img2vid':
        return <ImageToVideoView />;
      case 'gallery':
        return <GalleryView />;
      case 'projects':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by sidebar width 64 = 16rem = 256px) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pb-16">
          {renderActiveView()}
        </main>
      </div>

      {/* Lightbox / Asset Detail Fullscreen Modal */}
      <AssetDetailModal />

      {/* Global Interactive Toast Notifications */}
      <Toast />
    </div>
  );
}
