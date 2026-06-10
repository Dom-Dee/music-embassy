/** Curated Unsplash sources: music, studio, live, learning */
const local = (path: string) => path

export const images = {
  lessonsHero: local('/lessons/orchestra-hero.png'),
  // Cinematic, music-forward background for the hero.
  // (Musician performing / vocal + studio ambience)
  hero:
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2400&q=85',
  studio:
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85',
  live:
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=85',
  piano:
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1600&q=85',
  guitar:
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=85',
  teaching:
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=85',
  violin:
    'https://images.unsplash.com/photo-1465821185615-80befc40a7d6?auto=format&fit=crop&w=1600&q=85',
  drums:
    'https://images.unsplash.com/photo-1519892300165-cb5582e4c4d7?auto=format&fit=crop&w=1600&q=85',
  crowd:
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa7d?auto=format&fit=crop&w=1600&q=85',
  headphones:
    'https://images.unsplash.com/photo-1487180140151-fd5db514492b?auto=format&fit=crop&w=1600&q=85',
  mixer:
    'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1600&q=85',
  singer:
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=85',
  community:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85',
  workshop:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=85',
} as const
