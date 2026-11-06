# AI Creative Studio 🎨✨

A high-performance, lightweight personal AI studio for **Text-to-Image** and **Image-to-Video** generation with **zero mandatory subscription fees** and **zero paid APIs**.

Built with a hybrid architecture designed to run seamlessly on standard consumer hardware (including 8 GB RAM and legacy 2 GB GPUs), leveraging smart local processing alongside a **free remote Google Colab GPU runtime** for heavy models (FLUX, Stable Diffusion, Wan 2.1).

---

## 💻 Hardware Compatibility & Architecture

### System Profile
- **RAM**: 8 GB DDR3
- **VRAM**: 2 GB (NVIDIA GeForce GT 630M)
- **Local Storage**: 750 GB HDD (315+ GB free)
- **Operating System**: Windows

### Generation Strategy (Dual-Engine System)
1. **Mode A: Local Engine (Lightweight)**
   - Hardware-aware safety guardrails.
   - Prevents Out-Of-Memory (OOM) crashes by restricting local execution on 2 GB VRAM to compatible lightweight pipelines or CPU offloading.
   - Local storage management and gallery indexing.

2. **Mode B: Free Remote GPU Engine (Google Colab Runtime)**
   - Connects to an active, free Google Colab session running an NVIDIA T4 GPU (16 GB VRAM).
   - Generates high-fidelity **FLUX.1 / SDXL** images and **Wan 2.1 / SVD** animated videos.
   - Automatically downloads completed artifacts directly to your local computer's `storage/` directory without manual file transfers.

---

## 📁 Project Structure

```
AI-Creative-Studio/
├── frontend/             # React (Vite) + Tailwind CSS + Lucide Icons + Framer Motion
├── backend/              # FastAPI + SQLite + Async Generation Workers
├── workflows/            # ComfyUI and Generation Workflow JSONs
│   ├── image/            # SD / FLUX Text-to-Image workflow definitions
│   └── video/            # Wan / SVD Image-to-Video workflow definitions
├── notebooks/            # 1-Click Free Google Colab GPU Runtime Notebooks
├── storage/              # Local media storage
│   ├── images/           # Generated images (.png, .webp)
│   ├── videos/           # Generated videos (.mp4)
│   └── projects/         # Saved project bundles and metadata
└── README.md
```

---

## 🚀 Development Roadmap

- [x] **Phase 1: Environment Inspection & Project Structure Setup**
- [ ] **Phase 2: Frontend & Dashboard Development** (Dark luxury UI, Canvas, Prompt controls, Gallery, Settings)
- [ ] **Phase 3: FastAPI Backend & SQLite Database** (Job queue, storage manager, hardware health monitor)
- [ ] **Phase 4: Real Text-to-Image Engine Integration** (Local fallback + Free Colab/ComfyUI pipeline)
- [ ] **Phase 5: Real Image-to-Video Engine Integration** (Motion prompts, Wan / SVD video synthesis)
- [ ] **Phase 6: End-to-End Integration Testing & User Verification**
