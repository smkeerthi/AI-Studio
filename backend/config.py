import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Project root paths
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

# Storage paths
STORAGE_DIR = BASE_DIR / "storage"
IMAGES_DIR = STORAGE_DIR / "images"
VIDEOS_DIR = STORAGE_DIR / "videos"
PROJECTS_DIR = STORAGE_DIR / "projects"

# Ensure storage directories exist
for directory in [STORAGE_DIR, IMAGES_DIR, VIDEOS_DIR, PROJECTS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Database path
DATABASE_PATH = BACKEND_DIR / "studio.db"

# Server configuration
HOST = os.getenv("STUDIO_HOST", "127.0.0.1")
PORT = int(os.getenv("STUDIO_PORT", "8000"))
DEBUG = os.getenv("STUDIO_DEBUG", "True").lower() == "true"

# Safety boundaries
MAX_UPLOAD_SIZE_MB = 30
ALLOWED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".webm"}

# Hardware threshold guardrails
GPU_SAFETY_VRAM_THRESHOLD_GB = 4.0  # Above this, heavy local models are allowed

def is_safe_storage_path(path: Path) -> bool:
    """Verifies that a given path stays strictly inside the designated storage folder."""
    try:
        resolved = path.resolve()
        return STORAGE_DIR.resolve() in resolved.parents or resolved == STORAGE_DIR.resolve()
    except Exception:
        return False
