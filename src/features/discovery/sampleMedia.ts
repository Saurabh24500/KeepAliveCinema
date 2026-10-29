import type { MediaSummary } from '../../types/media'

export interface MediaRowData {
  id: string
  title: string
  description: string
  items: MediaSummary[]
}

export const sampleRows: MediaRowData[] = [
  {
    id: 'movies',
    title: 'Movies worth keeping',
    description: 'A sample row — real discovery data arrives with TMDB.',
    items: [
      {
        id: 'dune-part-two',
        title: 'Dune: Part Two',
        year: 2024,
        type: 'movie',
        genre: 'Sci-Fi',
        tone: 'amber',
      },
      {
        id: 'past-lives',
        title: 'Past Lives',
        year: 2023,
        type: 'movie',
        genre: 'Romance',
        tone: 'rose',
      },
      {
        id: 'the-batman',
        title: 'The Batman',
        year: 2022,
        type: 'movie',
        genre: 'Crime',
        tone: 'slate',
      },
      {
        id: 'everything-everywhere',
        title: 'Everything Everywhere All at Once',
        year: 2022,
        type: 'movie',
        genre: 'Sci-Fi',
        tone: 'violet',
      },
      {
        id: 'perfect-days',
        title: 'Perfect Days',
        year: 2023,
        type: 'movie',
        genre: 'Drama',
        tone: 'emerald',
      },
      {
        id: 'spirited-away',
        title: 'Spirited Away',
        year: 2001,
        type: 'movie',
        genre: 'Fantasy',
        tone: 'cyan',
      },
    ],
  },
  {
    id: 'anime',
    title: 'Anime picks',
    description: 'A sample row — provider filtering is not wired yet.',
    items: [
      {
        id: 'frieren',
        title: 'Frieren: Beyond Journey’s End',
        year: 2023,
        type: 'anime',
        genre: 'Fantasy',
        tone: 'cyan',
      },
      {
        id: 'attack-on-titan',
        title: 'Attack on Titan',
        year: 2013,
        type: 'anime',
        genre: 'Action',
        tone: 'rose',
      },
      {
        id: 'cowboy-bebop',
        title: 'Cowboy Bebop',
        year: 1998,
        type: 'anime',
        genre: 'Sci-Fi',
        tone: 'violet',
      },
      {
        id: 'vinland-saga',
        title: 'Vinland Saga',
        year: 2019,
        type: 'anime',
        genre: 'Historical',
        tone: 'amber',
      },
      {
        id: 'jujutsu-kaisen',
        title: 'Jujutsu Kaisen',
        year: 2020,
        type: 'anime',
        genre: 'Action',
        tone: 'slate',
      },
      {
        id: 'mob-psycho',
        title: 'Mob Psycho 100',
        year: 2016,
        type: 'anime',
        genre: 'Comedy',
        tone: 'emerald',
      },
    ],
  },
  {
    id: 'series',
    title: 'Series to settle into',
    description: 'A sample row — series discovery is planned for Milestone 4.',
    items: [
      {
        id: 'severance',
        title: 'Severance',
        year: 2022,
        type: 'series',
        genre: 'Mystery',
        tone: 'slate',
      },
      {
        id: 'the-bear',
        title: 'The Bear',
        year: 2022,
        type: 'series',
        genre: 'Drama',
        tone: 'amber',
      },
      {
        id: 'dark',
        title: 'Dark',
        year: 2017,
        type: 'series',
        genre: 'Sci-Fi',
        tone: 'violet',
      },
      {
        id: 'succession',
        title: 'Succession',
        year: 2018,
        type: 'series',
        genre: 'Drama',
        tone: 'emerald',
      },
      {
        id: 'arcane',
        title: 'Arcane',
        year: 2021,
        type: 'series',
        genre: 'Animation',
        tone: 'cyan',
      },
      {
        id: 'chernobyl',
        title: 'Chernobyl',
        year: 2019,
        type: 'series',
        genre: 'Drama',
        tone: 'rose',
      },
    ],
  },
]
