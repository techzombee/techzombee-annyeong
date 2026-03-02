import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBh1WOAHTZ3_uQcyD-Tee2rsv_MyJQLuyY',
  authDomain: 'techzombee-annyeong.firebaseapp.com',
  projectId: 'techzombee-annyeong',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Real Korean learning YouTube videos
const videos = [
  { youtubeId: 'OQSNhk5ICTI', title: 'Korean Alphabet in 1 Hour (Hangul)', level: 'Beginner', duration: '1:00:00', category: 'Daily Life' },
  { youtubeId: '_3lMBCRLXls', title: 'Learn Korean in 30 Minutes', level: 'Beginner', duration: '30:00', category: 'Daily Life' },
  { youtubeId: 'SQxlJMB9FKQ', title: 'Korean Drama Expressions', level: 'Intermediate', duration: '10:22', category: 'K-Drama' },
  { youtubeId: 'jHQBEBFHkxc', title: 'Honorifics & Formal Speech', level: 'Intermediate', duration: '9:15', category: 'K-Drama' },
  { youtubeId: '5SBmZgAhbYI', title: 'Learn Korean with BTS', level: 'Beginner', duration: '8:30', category: 'K-pop' },
  { youtubeId: 'hPqUMH5l3kI', title: 'Korean Slang from Variety Shows', level: 'Advanced', duration: '13:10', category: 'K-pop' },
];

// Add new
for (const video of videos) {
  await addDoc(collection(db, 'videos'), { ...video, createdAt: serverTimestamp() });
  console.log(`Added: ${video.title}`);
}

console.log('Done!');
process.exit(0);
