export type MusicQuote = {
  quote: string
  author: string
}

export const musicQuotes: MusicQuote[] = [
  {
    quote: 'Where words fail, music speaks.',
    author: 'Hans Christian Andersen',
  },
  {
    quote: 'Music is the shorthand of emotion.',
    author: 'Leo Tolstoy',
  },
  {
    quote: 'One good thing about music, when it hits you, you feel no pain.',
    author: 'Bob Marley',
  },
  {
    quote: 'Music expresses that which cannot be put into words.',
    author: 'Victor Hugo',
  },
  {
    quote: 'Life seems to go on without effort when I am filled with music.',
    author: 'George Eliot',
  },
  {
    quote: 'Music is the divine way to tell beautiful, poetic things to the heart.',
    author: 'Pablo Casals',
  },
  {
    quote: 'The only truth is music.',
    author: 'Jack Kerouac',
  },
  {
    quote: 'Music is the wine that fills the cup of silence.',
    author: 'Robert Fripp',
  },
  {
    quote: 'Without music, life would be a mistake.',
    author: 'Friedrich Nietzsche',
  },
  {
    quote: 'Music can change the world because it can change people.',
    author: 'Bono',
  },
  {
    quote: 'Practice isn’t the thing you do once you’re good. It’s the thing you do that makes you good.',
    author: 'Malcolm Gladwell',
  },
  {
    quote: 'The beautiful thing about learning is that nobody can take it away from you.',
    author: 'B.B. King',
  },
  {
    quote: 'I think music in itself is healing. It is an explosive expression of humanity.',
    author: 'Billy Joel',
  },
  {
    quote: 'Music is the strongest form of magic.',
    author: 'Marilyn Manson',
  },
  {
    quote: 'To play a wrong note is insignificant; to play without passion is inexcusable.',
    author: 'Ludwig van Beethoven',
  },
  {
    quote: 'Music is the language of the spirit. It opens the secret of life.',
    author: 'Kahlil Gibran',
  },
  {
    quote: 'Rhythm is everything in boxing. Same in life. Same in music.',
    author: 'Sugar Ray Leonard',
  },
  {
    quote: 'Jazz is not just music, it’s a way of life.',
    author: 'Wynton Marsalis',
  },
  {
    quote: 'The music is not in the notes, but in the silence between.',
    author: 'Wolfgang Amadeus Mozart',
  },
  {
    quote: 'A painter paints pictures on canvas. But musicians paint their pictures on silence.',
    author: 'Leopold Stokowski',
  },
  {
    quote: 'Music is the mediator between the spiritual and the sensual life.',
    author: 'Ludwig van Beethoven',
  },
  {
    quote: 'If I were not a physicist, I would probably be a musician.',
    author: 'Albert Einstein',
  },
  {
    quote: 'Music gives a soul to the universe, wings to the mind, flight to the imagination.',
    author: 'Plato',
  },
  {
    quote: 'The aim and final end of all music should be none other than the glory of God.',
    author: 'Johann Sebastian Bach',
  },
  {
    quote: 'Music is the emotional life of most people.',
    author: 'Leonard Bernstein',
  },
  {
    quote: 'You don’t get harmony when everybody sings the same note.',
    author: 'Doug Floyd',
  },
  {
    quote: 'Music is the great uniter. An incredible force.',
    author: 'Henry Wadsworth Longfellow',
  },
  {
    quote: 'Every artist dips his brush in his own soul, and paints his own nature into his pictures.',
    author: 'Henry Ward Beecher',
  },
  {
    quote: 'Talent is a gift, but practice is a choice.',
    author: 'Unknown',
  },
  {
    quote: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    quote: 'Music washes away from the soul the dust of everyday life.',
    author: 'Berthold Auerbach',
  },
]

export function getDailyMusicQuote(date = new Date()): MusicQuote {
  const dayKey =
    date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate()
  return musicQuotes[dayKey % musicQuotes.length]
}
