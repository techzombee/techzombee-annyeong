import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBh1WOAHTZ3_uQcyD-Tee2rsv_MyJQLuyY',
  authDomain: 'techzombee-annyeong.firebaseapp.com',
  projectId: 'techzombee-annyeong',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const videos = [
  { youtubeId: 'WFuNykzRDkk', title: 'Korean Greetings for Beginners', level: 'Beginner', duration: '5:24', category: 'Daily Life' },
  { youtubeId: 'jkSAuDwR4ok', title: 'How to Introduce Yourself in Korean', level: 'Beginner', duration: '7:10', category: 'Daily Life' },
  { youtubeId: 'RYHO8GzD78U', title: 'Korean Drama Phrases You Must Know', level: 'Intermediate', duration: '10:33', category: 'K-Drama' },
  { youtubeId: 'pf9HVqTU-rY', title: 'Understanding Korean Honorifics', level: 'Intermediate', duration: '8:45', category: 'K-Drama' },
  { youtubeId: 'U_9bGvQxEzA', title: 'K-pop Lyrics Korean Breakdown', level: 'Beginner', duration: '6:20', category: 'K-pop' },
  { youtubeId: 'YnopsTKsFiA', title: 'Advanced Korean Slang from Variety Shows', level: 'Advanced', duration: '12:15', category: 'K-pop' },
];

for (const video of videos) {
  await addDoc(collection(db, 'videos'), { ...video, createdAt: serverTimestamp() });
  console.log(`Added: ${video.title}`);
}

console.log('Done!');
process.exit(0);
