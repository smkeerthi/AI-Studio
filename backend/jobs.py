import uuid
import asyncio
import logging
from typing import Dict, Any, Optional, Callable
from .database import create_job, update_job, get_job

logger = logging.getLogger("studio.jobs")

class JobManager:
    """Manages asynchronous long-running generation jobs."""

    def __init__(self):
        self.active_tasks: Dict[str, asyncio.Task] = {}

    async def submit_job(self, job_type: str, worker_coro: Callable, *args, **kwargs) -> str:
        job_id = f"job_{uuid.uuid4().hex[:10]}"
        await create_job(job_id, job_type)

        # Launch background task
        task = asyncio.create_task(self._run_job_wrapper(job_id, worker_coro, *args, **kwargs))
        self.active_tasks[job_id] = task
        return job_id

    async def _run_job_wrapper(self, job_id: str, worker_coro: Callable, *args, **kwargs):
        try:
            await update_job(job_id, status="running", progress=10, stage="Starting generation worker...")
            result = await worker_coro(job_id, *args, **kwargs)
            result_url = result.get("url") or result.get("video_url")
            await update_job(job_id, status="completed", progress=100, stage="Finished", result_url=result_url)
        except Exception as e:
            logger.error(f"Job {job_id} encountered failure: {e}", exc_info=True)
            await update_job(job_id, status="failed", progress=0, stage="Failed", error=str(e))
        finally:
            self.active_tasks.pop(job_id, None)

    async def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        return await get_job(job_id)

job_manager = JobManager()
