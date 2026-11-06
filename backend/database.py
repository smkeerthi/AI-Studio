import aiosqlite
import json
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from .config import DATABASE_PATH

logger = logging.getLogger("studio.database")

def get_db():
    return aiosqlite.connect(DATABASE_PATH)

async def init_db():
    """Initializes SQLite schema and runs default migrations."""
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        # Creations table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS creations (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                title TEXT,
                prompt TEXT NOT NULL,
                negative_prompt TEXT,
                motion_prompt TEXT,
                style TEXT,
                aspect_ratio TEXT,
                width INTEGER,
                height INTEGER,
                seed INTEGER,
                engine TEXT,
                model TEXT,
                file_path TEXT,
                url TEXT,
                video_url TEXT,
                duration INTEGER,
                favorite INTEGER DEFAULT 0,
                project_id TEXT,
                created_at TEXT
            )
        """)

        # Projects table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                cover_url TEXT,
                created_at TEXT
            )
        """)

        # Jobs table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                progress INTEGER DEFAULT 0,
                stage TEXT,
                error TEXT,
                result_url TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        """)

        await conn.commit()

        # Seed initial projects and creations if table is empty
        cursor = await conn.execute("SELECT COUNT(*) as count FROM projects")
        row = await cursor.fetchone()
        if row and row["count"] == 0:
            await seed_default_data(conn)
            await conn.commit()

async def seed_default_data(conn: aiosqlite.Connection):
    """Populates clean starter projects and showcase items."""
    now = datetime.now().isoformat()
    projects = [
        ('proj-1', 'Cyberpunk Horizons', 'Futuristic cityscapes and character designs', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', now),
        ('proj-2', 'Studio Ghibli Dreams', 'Serene painterly anime landscapes and nature scenes', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', now),
        ('proj-3', 'Cinematic Portraits', 'Photorealistic character stills and dynamic lighting', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', now)
    ]
    await conn.executemany("INSERT INTO projects (id, name, description, cover_url, created_at) VALUES (?, ?, ?, ?, ?)", projects)

    creations = [
        (
            'creation-1', 'image', 'Neon Ronin in Neo-Tokyo Rain',
            'A cyberpunk ronin standing in neon-lit Tokyo rain, reflective chrome armor, glowing purple katana, volumetric foggy street lights, 8k resolution, cinematic atmosphere',
            'blurry, bad anatomy, deformed hands, low resolution, watermark', None,
            'Cinematic', '16:9', 1280, 720, 4829104, 'Colab Remote GPU (SDXL)', 'SDXL 1.0',
            'storage/images/creation-1.png', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
            None, None, 1, 'proj-1', now
        ),
        (
            'creation-2', 'video', 'Crystal Bioluminescent Bloom',
            'Enchanted crystal flower slowly blooming in a dark forest, petals radiating violet and cyan light',
            None, 'Camera slowly orbits 45 degrees, flower petals unfurl smoothly, shimmering light particles flutter in breeze',
            'Fantasy', '16:9', 1024, 576, 7392019, 'Colab Remote GPU (Wan 2.1)', 'Wan 2.1 14B',
            'storage/videos/creation-2.mp4', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
            'https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-in-the-dark-42878-large.mp4', 5, 1, 'proj-1', now
        ),
        (
            'creation-3', 'image', 'Floating Island Village at Sunset',
            'A breathtaking floating fantasy island with cascading waterfalls into clouds, tiny medieval houses with smoking chimneys, golden hour sunset, whimsical Studio Ghibli aesthetic',
            'ugly, deformed, disfigured, poor details, bad art', None,
            'Anime', '1:1', 1024, 1024, 1204918, 'Colab Remote GPU (FLUX.1)', 'FLUX.1-schnell',
            'storage/images/creation-3.png', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80',
            None, None, 0, 'proj-2', now
        )
    ]
    await conn.executemany("""
        INSERT INTO creations (
            id, type, title, prompt, negative_prompt, motion_prompt,
            style, aspect_ratio, width, height, seed, engine, model,
            file_path, url, video_url, duration, favorite, project_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, creations)

# ----------------- Creations Queries -----------------

async def get_creations(type_filter: Optional[str] = None, search: Optional[str] = None, project_id: Optional[str] = None, favorite_only: bool = False) -> List[Dict[str, Any]]:
    query = "SELECT * FROM creations WHERE 1=1"
    params = []

    if type_filter and type_filter != 'all':
        query += " AND type = ?"
        params.append(type_filter)

    if project_id and project_id != 'all':
        query += " AND project_id = ?"
        params.append(project_id)

    if favorite_only:
        query += " AND favorite = 1"

    if search:
        query += " AND (title LIKE ? OR prompt LIKE ? OR style LIKE ? OR model LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    query += " ORDER BY created_at DESC"

    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        cursor = await conn.execute(query, params)
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]

async def get_creation_by_id(creation_id: str) -> Optional[Dict[str, Any]]:
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        cursor = await conn.execute("SELECT * FROM creations WHERE id = ?", (creation_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None

async def insert_creation(data: Dict[str, Any]) -> Dict[str, Any]:
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        await conn.execute("""
            INSERT INTO creations (
                id, type, title, prompt, negative_prompt, motion_prompt,
                style, aspect_ratio, width, height, seed, engine, model,
                file_path, url, video_url, duration, favorite, project_id, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data['id'], data['type'], data.get('title'), data['prompt'],
            data.get('negative_prompt'), data.get('motion_prompt'),
            data.get('style'), data.get('aspect_ratio'), data.get('width'), data.get('height'),
            data.get('seed'), data.get('engine'), data.get('model'),
            data.get('file_path'), data.get('url'), data.get('video_url'),
            data.get('duration'), data.get('favorite', 0), data.get('project_id'),
            data.get('created_at', datetime.now().isoformat())
        ))
        await conn.commit()
    return data

async def delete_creation(creation_id: str) -> bool:
    async with get_db() as conn:
        cursor = await conn.execute("DELETE FROM creations WHERE id = ?", (creation_id,))
        await conn.commit()
        return cursor.rowcount > 0

async def update_creation_favorite(creation_id: str, favorite: int) -> bool:
    async with get_db() as conn:
        cursor = await conn.execute("UPDATE creations SET favorite = ? WHERE id = ?", (favorite, creation_id))
        await conn.commit()
        return cursor.rowcount > 0

async def update_creation_project(creation_id: str, project_id: Optional[str]) -> bool:
    async with get_db() as conn:
        cursor = await conn.execute("UPDATE creations SET project_id = ? WHERE id = ?", (project_id, creation_id))
        await conn.commit()
        return cursor.rowcount > 0

# ----------------- Projects Queries -----------------

async def get_projects() -> List[Dict[str, Any]]:
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        cursor = await conn.execute("SELECT * FROM projects ORDER BY created_at DESC")
        rows = await cursor.fetchall()
        projects = [dict(r) for r in rows]

        for proj in projects:
            c_cursor = await conn.execute("SELECT COUNT(*) as count FROM creations WHERE project_id = ?", (proj['id'],))
            c_row = await c_cursor.fetchone()
            proj['count'] = c_row['count'] if c_row else 0
        return projects

async def create_project(project_id: str, name: str, description: str = '', cover_url: str = '') -> Dict[str, Any]:
    now = datetime.now().isoformat()
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        await conn.execute("""
            INSERT INTO projects (id, name, description, cover_url, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (project_id, name, description, cover_url, now))
        await conn.commit()
    return {'id': project_id, 'name': name, 'description': description, 'cover_url': cover_url, 'count': 0, 'created_at': now}

# ----------------- Jobs Queries -----------------

async def create_job(job_id: str, job_type: str) -> Dict[str, Any]:
    now = datetime.now().isoformat()
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        await conn.execute("""
            INSERT INTO jobs (id, type, status, progress, stage, created_at, updated_at)
            VALUES (?, ?, 'pending', 0, 'Queued', ?, ?)
        """, (job_id, job_type, now, now))
        await conn.commit()
    return {'id': job_id, 'type': job_type, 'status': 'pending', 'progress': 0, 'stage': 'Queued'}

async def update_job(job_id: str, status: str, progress: int, stage: str, error: Optional[str] = None, result_url: Optional[str] = None):
    now = datetime.now().isoformat()
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        await conn.execute("""
            UPDATE jobs
            SET status = ?, progress = ?, stage = ?, error = ?, result_url = ?, updated_at = ?
            WHERE id = ?
        """, (status, progress, stage, error, result_url, now, job_id))
        await conn.commit()

async def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    async with get_db() as conn:
        conn.row_factory = aiosqlite.Row
        cursor = await conn.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None
