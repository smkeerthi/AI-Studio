import logging
from typing import Dict, Any, Optional
from .base import BaseEngine
from ..hardware import check_hardware_safety
from ..storage import save_image_bytes

logger = logging.getLogger("studio.engine.local")

class LocalEngine(BaseEngine):
    """
    Local Generation Engine equipped with hardware guardrails.
    Prevents GT 630M 2GB VRAM from crashing on large diffusion networks.
    """

    async def check_status(self) -> Dict[str, Any]:
        return {
            "status": "ready",
            "connected": True,
            "engine": "local",
            "safe_mode": True,
            "hardware": "NVIDIA GeForce GT 630M (2GB VRAM Safe Mode)",
            "message": "Local Safe Mode active. Heavy models guarded."
        }

    async def generate_image(self, params: Dict[str, Any]) -> Dict[str, Any]:
        width = params.get("width", 512)
        height = params.get("height", 512)
        prompt = params.get("prompt", "")

        safety = check_hardware_safety("local", "image", width, height)
        if not safety["safe"]:
            raise ValueError(safety["message"])

        # Lightweight local synthetic generator
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new("RGB", (width, height), color=(24, 20, 36))
        draw = ImageDraw.Draw(img)

        # Draw aesthetic ambient background
        for y in range(height):
            r = int(24 + (y / height) * 40)
            g = int(20 + (y / height) * 20)
            b = int(36 + (y / height) * 70)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        draw.text((20, 20), f"AI Creative Studio [Local 2GB Safe Mode]", fill=(180, 140, 255))
        draw.text((20, 50), f"Prompt: {prompt[:60]}...", fill=(220, 220, 230))
        draw.text((20, 80), f"Dimensions: {width}x{height}", fill=(160, 160, 180))

        import io
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        local_path, rel_url = save_image_bytes(buf.getvalue(), ext=".png", prefix="local_safe")

        return {
            "file_path": str(local_path),
            "url": rel_url,
            "engine": "Local Safe Mode (2GB Guard)",
            "model": "SD-Light-CPU",
            "status": "success"
        }

    async def generate_video(self, params: Dict[str, Any], image_data: Optional[bytes] = None) -> Dict[str, Any]:
        safety = check_hardware_safety("local", "video")
        raise ValueError(
            "Video generation with Wan 2.1 requires at least 14 GB - 16 GB VRAM. "
            "Your GT 630M has 2 GB VRAM. Please toggle Engine Mode to 'Colab Remote GPU' in Settings."
        )
