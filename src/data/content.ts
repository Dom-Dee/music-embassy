import { getInstrumentImageUrl } from '../lib/instrumentImages'
import { images } from './images'

export const featuredTracks = [
  {
    id: '1',
    title: 'Midnight Echoes',
    artist: 'Ama Serwah',
    cover: images.headphones,
  },
  {
    id: '2',
    title: 'Coastal Haze',
    artist: 'Kofi & The Tide',
    cover: images.guitar,
  },
  {
    id: '3',
    title: 'Velvet Sessions',
    artist: 'Nana Yaa',
    cover: images.piano,
  },
  {
    id: '4',
    title: 'Pulse of Accra',
    artist: 'The Embassy Collective',
    cover: images.live,
  },
  {
    id: '5',
    title: 'Analog Dreams',
    artist: 'Studio North',
    cover: images.mixer,
  },
  {
    id: '6',
    title: 'Strings & Soul',
    artist: 'Elijah Quartett',
    cover: images.violin,
  },
] as const

export const showcaseItems = [
  { id: 's1', title: 'Live at Liberty Hall', tag: 'Performance', img: images.live },
  { id: 's2', title: 'Session: Vocal Layers', tag: 'Studio', img: images.singer },
  { id: 's3', title: 'Rhythm Lab', tag: 'Education', img: images.drums },
  { id: 's4', title: 'Night Market Sound', tag: 'Showcase', img: images.crowd },
  { id: 's5', title: 'Mastering Workshop', tag: 'Workshop', img: images.studio },
  { id: 's6', title: 'Community Jam', tag: 'Community', img: images.community },
] as const

export const events = [
  {
    id: 'e1',
    date: 'Apr 12, 2026',
    title: 'Embassy Open Stage',
    description:
      'Emerging artists perform original work in an intimate listening room format.',
  },
  {
    id: 'e2',
    date: 'Apr 26, 2026',
    title: 'Production Deep Dive',
    description:
      'A full day intensive on arrangement, mixing, and creative workflow with guest engineers.',
  },
  {
    id: 'e3',
    date: 'May 10, 2026',
    title: 'World Strings Festival',
    description:
      'Collaborations across genres celebrating string instruments from classical to contemporary.',
  },
] as const

export const testimonials = [
  {
    id: 't1',
    quote:
      'The faculty treated my sound like art, not homework. I left with technique and confidence.',
    name: 'Yasmine O.',
    role: 'Pianist & songwriter',
  },
  {
    id: 't2',
    quote:
      'From first lesson to my first release, Music Embassy felt like a real creative partner.',
    name: 'Daniel K.',
    role: 'Producer',
  },
  {
    id: 't3',
    quote:
      'The community sessions are where ideas collide. I found collaborators I still work with.',
    name: 'Priya M.',
    role: 'Vocal coach',
  },
] as const

export const lessonTypes = [
  {
    title: 'Drums',
    description:
      'Time feel, kit technique, hand percussion, and locking with ensembles. From first beat to stage ready.',
    image: getInstrumentImageUrl('Drums'),
  },
  {
    title: 'Piano',
    description:
      'Classical foundations to contemporary harmony, technique, and performance at the keys.',
    image: getInstrumentImageUrl('Piano'),
  },
  {
    title: 'Saxophone',
    description:
      'Tone production, breath control, jazz phrasing, and ensemble skills for every setting.',
    image: getInstrumentImageUrl('Saxophone'),
  },
  {
    title: 'Voice Training',
    description:
      'Breath, tone, stage presence, and studio ready delivery. Find the power in your voice.',
    image: getInstrumentImageUrl('Voice Training'),
  },
] as const
