// API client for AI Creative Studio backend

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function getHardwareInfo() {
  try {
    const res = await fetch(`${API_BASE}/hardware`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      gpu_name: 'NVIDIA GeForce GT 630M (Legacy Safe Mode)',
      vram_gb: 2.0,
      ram_gb: 8.0,
      free_disk_gb: 315.0,
      colab_status: 'standby',
      safe_mode_active: true,
      error: err.message
    };
  }
}

export async function testColabConnection(colabUrl) {
  try {
    const res = await fetch(`${API_BASE}/settings/test-colab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: colabUrl }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Could not connect to Colab runtime URL: ' + err.message };
  }
}

export async function fetchGalleryItems(category = 'all', search = '') {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('type', category);
    if (search) params.append('q', search);

    const res = await fetch(`${API_BASE}/gallery?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend gallery fetch failed, using local cached items:', err.message);
    return null; // Signals caller to use local state fallback
  }
}

export async function deleteGalleryItem(id) {
  try {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function generateImage(payload) {
  try {
    const res = await fetch(`${API_BASE}/generate/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function generateVideo(formData) {
  try {
    const res = await fetch(`${API_BASE}/generate/video`, {
      method: 'POST',
      body: formData // multipart/form-data
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function getJobStatus(jobId) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'error', error: err.message };
  }
}
