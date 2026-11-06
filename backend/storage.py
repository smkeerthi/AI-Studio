import os
import uuid
import shutil
import logging
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException
from .config import (
    STORAGE_DIR, 
    IMAGES_DIR, 
    VIDEOS_DIR, 
    ALLOWED_IMAGE_EXTENSIONS, 
    ALLOWED_VIDEO_EXTENSIONS, 
    MAX_UPLOAD_SIZE_MB,
    is_safe_storage_path
)

logger = logging.getLogger("studio.storage")

def generate_file_id() -> str:
    return uuid.uuid4().hex[:12]

async def save_uploaded_image(file: UploadFile) -> Tuple[Path, str]:
    """Validates and saves an uploaded user image to storage/images/."""
    filename = file.filename or "upload.png"
    ext = Path(filename).suffix.lower()

    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )

    unique_name = f"upload_{generate_file_id()}{ext}"
    target_path = IMAGES_DIR / unique_name

    # Validate size & stream content
    size = 0
    with open(target_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):  # 1MB chunks
            size += len(chunk)
            if size > MAX_UPLOAD_SIZE_MB * 1024 * 1024:
                # Cleanup and abort
                target_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds maximum allowed size of {MAX_UPLOAD_SIZE_MB}MB."
                )
            buffer.write(chunk)

    rel_url = f"/storage/images/{unique_name}"
    return target_path, rel_url

def save_image_bytes(data: bytes, ext: str = ".png", prefix: str = "img") -> Tuple[Path, str]:
    """Saves raw image bytes into storage/images/."""
    unique_name = f"{prefix}_{generate_file_id()}{ext}"
    target_path = IMAGES_DIR / unique_name

    with open(target_path, "wb") as f:
        f.write(data)

    rel_url = f"/storage/images/{unique_name}"
    return target_path, rel_url

def save_video_bytes(data: bytes, ext: str = ".mp4", prefix: str = "vid") -> Tuple[Path, str]:
    """Saves raw video bytes into storage/videos/."""
    unique_name = f"{prefix}_{generate_file_id()}{ext}"
    target_path = VIDEOS_DIR / unique_name

    with open(target_path, "wb") as f:
        f.write(data)

    rel_url = f"/storage/videos/{unique_name}"
    return target_path, rel_url

def delete_stored_file(rel_path: str) -> bool:
    """Safely removes a file from local storage if within authorized bounds."""
    try:
        # Strip leading slashes
        clean_rel = rel_path.lstrip("/\\")
        if clean_rel.startswith("storage/"):
            clean_rel = clean_rel[len("storage/"):]

        full_path = STORAGE_DIR / clean_rel

        if not is_safe_storage_path(full_path):
            logger.warning(f"Prevented unauthorized deletion attempt outside storage: {full_path}")
            return False

        if full_path.is_file():
            full_path.unlink()
            return True
        return False
    except Exception as e:
        logger.error(f"Error deleting file {rel_path}: {e}")
        return False
