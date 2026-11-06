from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseEngine(ABC):
    """Abstract interface for generation engines (Local and Remote Colab)."""

    @abstractmethod
    async def generate_image(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Runs text-to-image synthesis and returns result metadata with local file path."""
        pass

    @abstractmethod
    async def generate_video(self, params: Dict[str, Any], image_path: str) -> Dict[str, Any]:
        """Runs image-to-video synthesis and returns result metadata with local file path."""
        pass

    @abstractmethod
    async def check_status(self) -> Dict[str, Any]:
        """Checks connectivity and runtime readiness."""
        pass
