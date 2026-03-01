/**
 * Run once to seed Firestore with sample videos:
 *   npx ts-node --skip-project scripts/seedVideos.ts
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or firebase-admin service account.
 * Easier: just paste these into Firestore Console manually.
 */

const SAMPLE_VIDEOS = [
  {
    youtubeId: 'WFuNykzRDkk',
    title: 'Korean Greetings for Beginners',
    level: 'Beginner',
    duration: '5:24',
    category: 'Daily Life',
  },
  {
    youtubeId: 'jkSAuDwR4ok',
    title: 'How to Introduce Yourself in Korean',
    level: 'Beginner',
    duration: '7:10',
    category: 'Daily Life',
  },
  {
    youtubeId: 'RYHO8GzD78U',
    title: 'Korean Drama Phrases You Must Know',
    level: 'Intermediate',
    duration: '10:33',
    category: 'K-Drama',
  },
  {
    youtubeId: 'pf9HVqTU-rY',
    title: 'Understanding Korean Honorifics',
    level: 'Intermediate',
    duration: '8:45',
    category: 'K-Drama',
  },
  {
    youtubeId: 'U_9bGvQxEzA',
    title: 'K-pop Lyrics Korean Breakdown',
    level: 'Beginner',
    duration: '6:20',
    category: 'K-pop',
  },
  {
    youtubeId: 'YnopsTKsFiA',
    title: 'Advanced Korean Slang from Variety Shows',
    level: 'Advanced',
    duration: '12:15',
    category: 'K-pop',
  },
];

console.log('Paste these into Firestore Console (videos collection):');
console.log(JSON.stringify(SAMPLE_VIDEOS, null, 2));
