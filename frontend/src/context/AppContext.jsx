import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CREATIONS, INITIAL_PROJECTS } from '../data/sampleData';
import { checkBackendHealth, getHardwareInfo, fetchGalleryItems } from '../api/client';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [engineMode, setEngineMode] = useState(() => localStorage.getItem('ai_studio_engine_mode') || 'colab');
  const [colabUrl, setColabUrl] = useState(() => localStorage.getItem('ai_studio_colab_url') || '');
  const [colabStatus, setColabStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  
  const [hardware, setHardware] = useState({
    gpu_name: 'NVIDIA GeForce GT 630M',
    vram_gb: 2.0,
    ram_gb: 8.0,
    free_disk_gb: 315.4,
    safe_mode_active: true
  });

  const [creations, setCreations] = useState(() => {
    const saved = localStorage.getItem('ai_studio_creations');
    return saved ? JSON.parse(saved) : INITIAL_CREATIONS;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ai_studio_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // State for passing generated image directly into Video studio
  const [sourceImageForVideo, setSourceImageForVideo] = useState(null);

  // Asset detail modal
  const [detailItem, setDetailItem] = useState(null);

  // Active generating jobs
  const [activeJob, setActiveJob] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist creations to localStorage
  useEffect(() => {
    localStorage.setItem('ai_studio_creations', JSON.stringify(creations));
  }, [creations]);

  // Persist projects
  useEffect(() => {
    localStorage.setItem('ai_studio_projects', JSON.stringify(projects));
  }, [projects]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('ai_studio_engine_mode', engineMode);
  }, [engineMode]);

  useEffect(() => {
    localStorage.setItem('ai_studio_colab_url', colabUrl);
  }, [colabUrl]);

  // Check health and hardware periodically
  useEffect(() => {
    const checkStatus = async () => {
      const health = await checkBackendHealth();
      setBackendStatus(health.status === 'ok' ? 'online' : 'offline');

      if (health.status === 'ok') {
        const hw = await getHardwareInfo();
        if (hw && !hw.error) {
          setHardware(hw);
        }
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Creation actions
  const addCreation = (item) => {
    const newItem = {
      id: 'creation-' + Date.now(),
      createdAt: new Date().toISOString(),
      favorite: false,
      ...item
    };
    setCreations((prev) => [newItem, ...prev]);
    addToast('Creation Saved', `"${newItem.title || 'Untitled'}" is saved to your local gallery!`, 'success');
    return newItem;
  };

  const deleteCreation = (id) => {
    setCreations((prev) => prev.filter((item) => item.id !== id));
    if (detailItem && detailItem.id === id) {
      setDetailItem(null);
    }
    addToast('Deleted', 'Item removed from your gallery.', 'info');
  };

  const toggleFavorite = (id) => {
    setCreations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  };

  const createProject = (name, description = '') => {
    const newProj = {
      id: 'proj-' + Date.now(),
      name,
      description,
      count: 0,
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    };
    setProjects((prev) => [newProj, ...prev]);
    addToast('Project Created', `Folder "${name}" is ready.`, 'success');
  };

  const assignToProject = (creationId, projectId) => {
    setCreations((prev) =>
      prev.map((c) => (c.id === creationId ? { ...c, projectId } : c))
    );
    addToast('Project Updated', 'Creation assigned to project folder.', 'success');
  };

  const transferToVideo = (imageAsset) => {
    setSourceImageForVideo(imageAsset);
    setCurrentTab('img2vid');
    addToast('Loaded Image into Video Studio', 'Describe your desired motion and animate!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        engineMode,
        setEngineMode,
        colabUrl,
        setColabUrl,
        colabStatus,
        setColabStatus,
        backendStatus,
        hardware,
        creations,
        projects,
        activeJob,
        setActiveJob,
        sourceImageForVideo,
        setSourceImageForVideo,
        detailItem,
        setDetailItem,
        toasts,
        addToast,
        removeToast,
        addCreation,
        deleteCreation,
        toggleFavorite,
        createProject,
        assignToProject,
        transferToVideo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
