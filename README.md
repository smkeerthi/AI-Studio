# AI Creative Studio 🎨✨

A complete, high-performance personal AI web application for **Text-to-Image** and **Image-to-Video** generation with **zero mandatory subscription fees** and **zero paid APIs**.

Built with a hybrid dual-engine architecture designed specifically for standard consumer hardware (including 8 GB RAM and legacy 2 GB GPUs), leveraging smart local processing alongside a **free remote Google Colab GPU runtime** for heavy models (FLUX, Stable Diffusion XL, Wan 2.1).

---

## 💻 Hardware Compatibility & Architecture

### System Profile
- **RAM**: 8 GB DDR3 (7.84 GB usable)
- **VRAM**: 2 GB (NVIDIA GeForce GT 630M)
- **Storage**: 750 GB HDD (314+ GB free space on C:)
- **Operating System**: Windows

### Dual-Engine Free Generation Architecture
1. **Mode A: Local Engine (Hardware-Aware Safe Mode)**
   - Protects your 2 GB graphics card and 8 GB RAM from Out-Of-Memory (OOM) crashes and system freezes.
   - Allows safe lightweight renders (512×512) with CPU offloading.
   - Manages SQLite database, local media indexing, and sandboxed storage in `storage/`.

2. **Mode B: Remote Free GPU Engine (Google Colab Runtime)**
   - Connects to a free Google Colab session running an **NVIDIA T4 GPU (16 GB VRAM)**.
   - Generates high-fidelity **FLUX.1 / SDXL** images and **Wan 2.1 / SVD** animated videos.
   - Automatically downloads completed artifacts directly to your local computer's `storage/images/` and `storage/videos/` folders with zero file transfer hassle.
   - Exposes a secure temporary tunnel via Cloudflare (`trycloudflare.com`) with no accounts or subscriptions needed.

---

## 🚀 Quick Start Guide

### 1-Click Launch
Double-click `start.bat` in the project root:
```bat
start.bat
```
This automatically launches:
1. **FastAPI Backend** on `http://127.0.0.1:8000`
2. **React (Vite) Frontend** on `http://127.0.0.1:5173`
3. Opens your default web browser to `http://localhost:5173`.

---

## ☁️ How to Use the Free Google Colab GPU (Mode B)

1. Open [Google Colab](https://colab.research.google.com/) in your browser.
2. Click **File → Upload notebook** and select:
   ```
   notebooks/ai_studio_colab_backend.ipynb
   ```
3. Set runtime to free GPU: **Runtime → Change runtime type → T4 GPU** (Free tier).
4. Click **Runtime → Run all**.
5. After ~90 seconds, the final cell will output your free public tunnel URL:
   ```
   👉 https://xxxxxxxx.trycloudflare.com 👈
   ```
6. Copy that URL, open **AI Creative Studio → Settings**, paste it into the **Google Colab Remote Runtime URL** box, and click **Test Connection**.
7. You now have unlimited 16 GB VRAM GPU power for FLUX.1 and Wan 2.1 video!

---

## 📁 Project Structure

```
AI-Creative-Studio/
├── frontend/                     # React 19 + Vite 8 + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/           # Sidebar, Topbar, Modal, Toast notifications
│   │   ├── views/                # Dashboard, TextToImage, ImageToVideo, Gallery, Projects, Settings
│   │   ├── context/              # AppContext global state manager
│   │   ├── api/                  # Backend REST API client
│   │   └── data/                 # Sample showcase assets and motion presets
├── backend/                      # Python FastAPI + SQLite Database
│   ├── app.py                    # RESTful endpoints & static media serving
│   ├── database.py               # Async SQLite schema & CRUD operations
│   ├── hardware.py               # System diagnostic auditor & 2GB VRAM safety guard
│   ├── storage.py                # Sandboxed local file storage manager
│   ├── jobs.py                   # Asynchronous background generation queue
│   └── engines/                  # Colab GPU bridge & Local safe engine
├── workflows/                    # ComfyUI generation workflow JSON files
│   ├── image/
│   │   ├── sdxl_workflow.json    # Stable Diffusion XL pipeline
│   │   └── flux_workflow.json    # FLUX.1 Schnell pipeline
│   └── video/
│       ├── wan_i2v_workflow.json # Wan 2.1 14B image-to-video pipeline
│       └── svd_workflow.json     # Stable Video Diffusion XT pipeline
├── notebooks/
│   └── ai_studio_colab_backend.ipynb  # 1-Click Free Colab T4 GPU notebook
├── storage/                      # Local media storage on your PC
│   ├── images/                   # Generated PNG images
│   ├── videos/                   # Generated MP4 videos
│   └── projects/                 # Saved project collections & metadata
├── start.bat                     # 1-Click Windows desktop launcher
└── README.md
```

---

## 📡 Backend API Reference

- `GET /api/health`: Health status and storage directory check.
- `GET /api/hardware`: System RAM, free storage, and NVIDIA GPU audit.
- `GET /api/models`: Open-weight model catalogue.
- `POST /api/settings/test-colab`: Verifies Colab tunnel connection.
- `POST /api/generate/image`: Synthesizes images and writes `.png` to `storage/images/`.
- `POST /api/generate/video`: Synthesizes motion video and writes `.mp4` to `storage/videos/`.
- `GET /api/jobs/{job_id}`: Polls asynchronous job progress (0–100%).
- `GET /api/gallery`: Retrieves gallery items with filters, search, and sorting.
- `DELETE /api/gallery/{id}`: Deletes creation from SQLite and removes file from disk.
- `GET /api/projects`: Lists project folders and counts.
- `POST /api/projects`: Creates a new themed project collection.
- `GET /storage/...`: Direct static media serving for browser display.

---

## 🔒 Security & Hardware Guardrails

- **Zero API Key Leakage**: No paid credentials or private tokens are hardcoded or exposed in frontend code.
- **Directory Traversal Protection**: File operations are strictly locked to `storage/`.
- **Hardware OOM Guard**: Intercepts requests that exceed the 2 GB VRAM threshold locally to prevent system freezes.
