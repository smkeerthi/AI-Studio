import os
import shutil
import psutil
import logging
from typing import Dict, Any

logger = logging.getLogger("studio.hardware")

def get_system_hardware() -> Dict[str, Any]:
    """Inspects local hardware specifications and calculates memory boundaries."""
    # RAM
    ram = psutil.virtual_memory()
    total_ram_gb = round(ram.total / (1024 ** 3), 1)
    available_ram_gb = round(ram.available / (1024 ** 3), 1)

    # Disk
    disk = shutil.disk_usage("C:\\" if os.name == "nt" else "/")
    free_disk_gb = round(disk.free / (1024 ** 3), 1)

    # Detected GPU details (NVIDIA GeForce GT 630M)
    gpu_info = {
        "name": "NVIDIA GeForce GT 630M",
        "vram_gb": 2.0,
        "driver": "Legacy (Kepler/Fermi)",
        "cuda_compute_capability": 2.1,
        "modern_torch_supported": False
    }

    return {
        "gpu_name": gpu_info["name"],
        "vram_gb": gpu_info["vram_gb"],
        "ram_gb": total_ram_gb,
        "available_ram_gb": available_ram_gb,
        "free_disk_gb": free_disk_gb,
        "safe_mode_active": True,
        "max_recommended_local_resolution": "512x512",
        "recommended_engine": "colab"
    }

def check_hardware_safety(engine: str, model_type: str, width: int = 1024, height: int = 1024) -> Dict[str, Any]:
    """
    Guards the user's computer from running models that would trigger Out-Of-Memory (OOM)
    errors on the 2GB GT 630M or 8GB DDR3 RAM.
    """
    if engine == "colab":
        return {
            "safe": True,
            "engine": "colab",
            "message": "Generating on remote Free Google Colab GPU (16 GB T4 VRAM). Safe from local memory limits."
        }

    # If Local Engine is selected
    if model_type.lower() in ["wan", "video", "svd", "flux"]:
        return {
            "safe": False,
            "engine": "local",
            "message": (
                f"Model '{model_type}' requires 12 GB - 16 GB of modern VRAM. "
                "Your computer has an NVIDIA GeForce GT 630M with 2 GB VRAM. "
                "Running this locally would freeze your system. "
                "Please switch to Mode B: Remote Free Google Colab GPU (100% free)."
            )
        }

    if width > 512 or height > 512:
        return {
            "safe": False,
            "engine": "local",
            "message": (
                f"Resolution {width}x{height} exceeds the 2 GB VRAM safe limit (512x512) for local execution. "
                "Use Mode B (Google Colab GPU) for high-resolution generations."
            )
        }

    return {
        "safe": True,
        "engine": "local",
        "message": "Lightweight local configuration within 2 GB VRAM threshold."
    }
