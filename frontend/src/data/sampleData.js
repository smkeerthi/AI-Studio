// Initial showcase and placeholder assets for AI Creative Studio

export const INITIAL_PROJECTS = [
  { id: 'proj-1', name: 'Cyberpunk Horizons', description: 'Futuristic cityscapes and character designs', count: 4, cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80' },
  { id: 'proj-2', name: 'Studio Ghibli Dreams', description: 'Serene painterly anime landscapes and nature scenes', count: 3, cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80' },
  { id: 'proj-3', name: 'Cinematic Portraits', description: 'Photorealistic character stills and dynamic lighting', count: 2, cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
];

export const INITIAL_CREATIONS = [
  {
    id: 'creation-1',
    type: 'image',
    title: 'Neon Ronin in Neo-Tokyo Rain',
    prompt: 'A cyberpunk ronin standing in neon-lit Tokyo rain, reflective chrome armor, glowing purple katana, volumetric foggy street lights, 8k resolution, cinematic atmosphere',
    negativePrompt: 'blurry, bad anatomy, deformed hands, low resolution, watermark',
    style: 'Cinematic',
    aspectRatio: '16:9',
    width: 1280,
    height: 720,
    engine: 'Colab Remote GPU (SDXL)',
    model: 'SDXL 1.0',
    seed: 4829104,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    favorite: true,
    projectId: 'proj-1',
  },
  {
    id: 'creation-2',
    type: 'video',
    title: 'Crystal Bioluminescent Bloom',
    prompt: 'Enchanted crystal flower slowly blooming in a dark forest, petals radiating violet and cyan light, camera orbits smoothly, gentle pollen drifting in air',
    motionPrompt: 'Camera slowly orbits 45 degrees, flower petals unfurl smoothly, shimmering light particles flutter in breeze',
    duration: 5,
    style: 'Fantasy',
    aspectRatio: '16:9',
    width: 1024,
    height: 576,
    engine: 'Colab Remote GPU (Wan 2.1)',
    model: 'Wan 2.1 14B',
    seed: 7392019,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-in-the-dark-42878-large.mp4',
    favorite: true,
    projectId: 'proj-1',
  },
  {
    id: 'creation-3',
    type: 'image',
    title: 'Floating Island Village at Sunset',
    prompt: 'A breathtaking floating fantasy island with cascading waterfalls into clouds, tiny medieval houses with smoking chimneys, golden hour sunset, whimsical Studio Ghibli aesthetic, oil painting texture',
    negativePrompt: 'ugly, deformed, disfigured, poor details, bad art',
    style: 'Anime',
    aspectRatio: '1:1',
    width: 1024,
    height: 1024,
    engine: 'Colab Remote GPU (FLUX.1)',
    model: 'FLUX.1-schnell',
    seed: 1204918,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80',
    favorite: false,
    projectId: 'proj-2',
  },
  {
    id: 'creation-4',
    type: 'video',
    title: 'Cyberpunk Girl Head Turn & Blink',
    prompt: 'Cybernetic female character with purple tinted hair and subtle facial LED circuitry in a high-tech laboratory',
    motionPrompt: 'Make the character slowly turn their head, blink naturally, and move their hair gently in the wind. Use cinematic camera movement.',
    duration: 3,
    style: 'Realistic',
    aspectRatio: '9:16',
    width: 576,
    height: 1024,
    engine: 'Colab Remote GPU (Wan 2.1)',
    model: 'Wan 2.1 14B',
    seed: 8819203,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31911-large.mp4',
    favorite: true,
    projectId: 'proj-1',
  },
  {
    id: 'creation-5',
    type: 'image',
    title: 'Ethereal Forest Spirit',
    prompt: 'Mythical deer spirit made of starlight and moss standing in an ancient moonlit grove, deep purple mist, glowing runes on antlers, cinematic lighting, 8k digital painting',
    negativePrompt: 'blurry, mutated, text, watermark',
    style: 'Fantasy',
    aspectRatio: '4:3',
    width: 1024,
    height: 768,
    engine: 'Colab Remote GPU (FLUX.1)',
    model: 'FLUX.1-dev',
    seed: 5543128,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    favorite: false,
    projectId: 'proj-2',
  }
];

export const STYLE_PRESETS = [
  { id: 'realistic', name: 'Realistic', icon: '📸', desc: 'Photographic realism, lifelike skin & optical lighting' },
  { id: 'anime', name: 'Anime', icon: '🌸', desc: 'Japanese animation, cel-shading & expressive aesthetics' },
  { id: 'mature-2d', name: 'Mature 2D Cartoon', icon: '🎨', desc: 'Graphic novel, stylized line-art & bold colors' },
  { id: '3d', name: '3D', icon: '💎', desc: 'Pixar / Octane render, raytraced reflections & depth' },
  { id: 'cinematic', name: 'Cinematic', icon: '🎬', desc: '35mm anamorphic lens, film grain & dramatic shadows' },
  { id: 'fantasy', name: 'Fantasy', icon: '✨', desc: 'Mystical magic, ethereal glow & enchanting environments' },
  { id: 'digital-art', name: 'Digital Art', icon: '🖌️', desc: 'Concept art, textured brush strokes & painterly feel' },
  { id: 'manga', name: 'Manga', icon: '📖', desc: 'Monochrome screentone, ink crosshatching & dynamic action' },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', icon: '■', desc: 'Instagram, Avatars, Icons', width: 1024, height: 1024 },
  { id: '16:9', label: '16:9 Landscape', icon: '▬', desc: 'YouTube, Desktop, Wallpapers', width: 1024, height: 576 },
  { id: '9:16', label: '9:16 Portrait', icon: '▮', desc: 'TikTok, Reels, Phone Stories', width: 576, height: 1024 },
  { id: '4:3', label: '4:3 Classic', icon: '▭', desc: 'Standard photo & monitors', width: 1024, height: 768 },
];

export const SAMPLE_PROMPTS = [
  "A majestic cybernetic white tiger with glowing purple circuit patterns resting on an ancient temple roof overlooking a neon cyberpunk metropolis at midnight.",
  "Ethereal bioluminescent jellyfish floating gracefully through an autumn forest canopy under starry twilight, soft violet spores drifting.",
  "Anime concept art of a quiet train cabin travelling along water tracks during a golden sunset, ripples reflecting pastel clouds.",
  "Close-up cinematic portrait of an astronaut looking at an alien crystal nebula reflecting on the gold helmet visor, 8k resolution photorealistic.",
  "Mythological ancient library carved inside a giant hollowed redwood tree, glowing lanterns, spiraling mossy staircases, fantasy digital painting."
];

export const MOTION_PROMPTS = [
  "Make the character slowly turn their head, blink naturally, and move their hair gently in the wind. Use cinematic camera movement.",
  "Camera slowly dollies forward as warm golden sunlight glints through the tree branches, gentle breeze swaying leaves.",
  "Slow-motion water droplets splashing upwards in reverse, glowing with purple luminescence, camera orbiting smoothly.",
  "Dynamic camera pan following the subject walking through a neon-lit rain-slicked street, reflections shimmering in puddles.",
  "Gentle breathing animation, chest rises and falls softly, subtle eye blink, micro-expressions with cinematic lighting."
];
