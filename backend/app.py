import logging
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .config import STORAGE_DIR, HOST, PORT, DEBUG
from .database import (
    init_db, 
    get_creations, 
    insert_creation, 
    delete_creation, 
    update_creation_favorite, 
    update_creation_project,
    get_projects, 
    create_project,
    get_job
)
from .hardware import get_system_hardware, check_hardware_safety
from .storage import save_uploaded_image, delete_stored_file
from .engines.colab_engine import ColabEngine
from .engines.local_engine import LocalEngine
from .jobs import job_manager

# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("studio.app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AI Creative Studio Database...")
    await init_db()
    logger.info(f"AI Creative Studio Backend ready on http://{HOST}:{PORT}")
    yield
    logger.info("AI Creative Studio Backend shutting down.")

app = FastAPI(
    title="AI Creative Studio Backend",
    description="Lightweight personal AI generation server with hardware guardrails and Colab GPU bridge.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for generated and uploaded media
app.mount("/storage", StaticFiles(directory=str(STORAGE_DIR)), name="storage")

# ----------------- Pydantic Schemas -----------------

class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Text prompt for image synthesis")
    negative_prompt: Optional[str] = "blurry, low quality, deformed"
    style: Optional[str] = "Cinematic"
    aspect_ratio: Optional[str] = "1:1"
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    seed: Optional[int] = None
    steps: Optional[int] = 25
    guidance_scale: Optional[float] = 6.5
    engine: Optional[str] = "colab"  # 'colab' or 'local'
    colab_url: Optional[str] = None
    project_id: Optional[str] = None

class TestColabRequest(BaseModel):
    url: str

class CreateProjectRequest(BaseModel):
    name: str = Field(..., min_length=1)
    description: Optional[str] = ""

# ----------------- Health & Diagnostics Endpoints -----------------

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "app": "AI Creative Studio",
        "version": "1.0.0",
        "storage_ready": STORAGE_DIR.exists()
    }

@app.get("/api/hardware")
async def hardware_audit():
    return get_system_hardware()

@app.get("/api/models")
async def available_models():
    return {
        "image_models": [
            {
                "id": "flux-schnell",
                "name": "FLUX.1 Schnell",
                "type": "Open Weights",
                "recommended_runtime": "Google Colab T4 GPU (16GB)",
                "local_safe": False
            },
            {
                "id": "sdxl-base",
                "name": "Stable Diffusion XL 1.0",
                "type": "Open Weights",
                "recommended_runtime": "Google Colab T4 GPU (16GB)",
                "local_safe": False
            },
            {
                "id": "sd-1.5-light",
                "name": "SD 1.5 Safe Mode (CPU)",
                "type": "Lightweight",
                "recommended_runtime": "Local Computer",
                "local_safe": True
            }
        ],
        "video_models": [
            {
                "id": "wan-2.1-14b",
                "name": "Wan 2.1 Video (14B Open Weights)",
                "type": "Image-to-Video Diffusion",
                "recommended_runtime": "Google Colab T4 GPU (16GB)",
                "local_safe": False
            },
            {
                "id": "svd-xt",
                "name": "Stable Video Diffusion XT",
                "type": "Image-to-Video",
                "recommended_runtime": "Google Colab T4 GPU (16GB)",
                "local_safe": False
            }
        ]
    }

@app.post("/api/settings/test-colab")
async def test_colab(payload: TestColabRequest):
    engine = ColabEngine(payload.url)
    status = await engine.check_status()
    return status

# ----------------- Generation Endpoints -----------------

@app.post("/api/generate/image")
async def generate_image_endpoint(payload: ImageGenerationRequest):
    logger.info(f"Received Image Generation request: prompt='{payload.prompt[:40]}...' engine={payload.engine}")

    # Check hardware guardrails if user attempts local execution
    if payload.engine == "local":
        safety = check_hardware_safety("local", "image", payload.width, payload.height)
        if not safety["safe"]:
            raise HTTPException(status_code=400, detail=safety["message"])
        engine = LocalEngine()
    else:
        engine = ColabEngine(payload.colab_url)

    try:
        result = await engine.generate_image(payload.model_dump())

        # Save to database
        creation_data = {
            "id": f"creation_{generate_file_id()}",
            "type": "image",
            "title": payload.prompt[:36] + ("..." if len(payload.prompt) > 36 else ""),
            "prompt": payload.prompt,
            "negative_prompt": payload.negative_prompt,
            "style": payload.style,
            "aspect_ratio": payload.aspect_ratio,
            "width": payload.width,
            "height": payload.height,
            "seed": payload.seed,
            "engine": result.get("engine", "Colab Remote GPU"),
            "model": result.get("model", "FLUX.1-schnell"),
            "file_path": result.get("file_path"),
            "url": result.get("url"),
            "favorite": 0,
            "project_id": payload.project_id
        }
        await insert_creation(creation_data)
        return creation_data

    except Exception as e:
        logger.error(f"Image generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate/video")
async def generate_video_endpoint(
    motion_prompt: str = Form(...),
    duration: int = Form(3),
    resolution: str = Form("1024x576"),
    fps: int = Form(16),
    engine: str = Form("colab"),
    colab_url: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    logger.info(f"Received Video Generation request: motion_prompt='{motion_prompt[:40]}...' engine={engine}")

    # Hardware Guard: Enforce remote GPU for video models
    if engine == "local":
        safety = check_hardware_safety("local", "video")
        raise HTTPException(status_code=400, detail=safety["message"])

    # Process source keyframe image
    image_bytes = None
    source_url = image_url

    if image:
        image_path, rel_url = await save_uploaded_image(image)
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        source_url = rel_url

    active_engine = ColabEngine(colab_url)
    try:
        video_result = await active_engine.generate_video({
            "motion_prompt": motion_prompt,
            "duration": duration,
            "fps": fps,
            "resolution": resolution,
            "colab_url": colab_url
        }, image_data=image_bytes)

        [w, h] = resolution.split("x") if "x" in resolution else [1024, 576]

        creation_data = {
            "id": f"creation_{generate_file_id()}",
            "type": "video",
            "title": "Wan 2.1 Video Motion",
            "prompt": "Source Image Animation",
            "motion_prompt": motion_prompt,
            "style": "Cinematic",
            "aspect_ratio": "16:9" if resolution == "1024x576" else "9:16",
            "width": int(w),
            "height": int(h),
            "duration": duration,
            "engine": video_result.get("engine", "Colab Remote GPU (Wan 2.1)"),
            "model": video_result.get("model", "Wan 2.1 14B"),
            "file_path": video_result.get("file_path"),
            "url": source_url or video_result.get("url"),
            "video_url": video_result.get("video_url"),
            "favorite": 0
        }
        await insert_creation(creation_data)
        return creation_data

    except Exception as e:
        logger.error(f"Video synthesis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/jobs/{job_id}")
async def get_job_endpoint(job_id: str):
    job = await job_manager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# ----------------- Gallery Endpoints -----------------

@app.get("/api/gallery")
async def get_gallery(
    type: Optional[str] = Query(None, description="Filter by 'image', 'video', or 'all'"),
    q: Optional[str] = Query(None, description="Search term across prompts and titles"),
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    favorite: Optional[bool] = Query(False, description="Filter favorites only")
):
    items = await get_creations(type_filter=type, search=q, project_id=project_id, favorite_only=favorite)
    return items

@app.delete("/api/gallery/{creation_id}")
async def delete_gallery_item(creation_id: str):
    items = await get_creations(type_filter=None)
    target = next((x for x in items if x["id"] == creation_id), None)

    if target and target.get("file_path"):
        delete_stored_file(target["file_path"])

    success = await delete_creation(creation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Creation not found")
    return {"success": True, "id": creation_id}

@app.post("/api/gallery/{creation_id}/favorite")
async def toggle_favorite(creation_id: str, favorite: int = Form(...)):
    success = await update_creation_favorite(creation_id, favorite)
    return {"success": success, "id": creation_id, "favorite": favorite}

@app.post("/api/gallery/{creation_id}/project")
async def assign_project(creation_id: str, project_id: Optional[str] = Form(None)):
    success = await update_creation_project(creation_id, project_id)
    return {"success": success, "id": creation_id, "project_id": project_id}

# ----------------- Projects Endpoints -----------------

@app.get("/api/projects")
async def list_projects():
    return await get_projects()

@app.post("/api/projects")
async def create_new_project(payload: CreateProjectRequest):
    new_id = f"proj_{generate_file_id()}"
    created = await create_project(new_id, payload.name, payload.description)
    return created

def generate_file_id() -> str:
    import uuid
    return uuid.uuid4().hex[:10]
