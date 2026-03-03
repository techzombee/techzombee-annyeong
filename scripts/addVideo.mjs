/**
 * Add a video to Firestore by YouTube ID.
 * Usage:
 *   node scripts/addVideo.mjs <youtubeId> <category> <level>
 *
 * Example:
 *   node scripts/addVideo.mjs Y6VERCSoz7E "K-meme" "Advanced"
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FIREBASE_API_KEY = 'AIzaSyBh1WOAHTZ3_uQcyD-Tee2rsv_MyJQLuyY';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'techzombee-annyeong.firebaseapp.com',
  projectId: 'techzombee-annyeong',
};

const [youtubeId, category, level] = process.argv.slice(2);

if (!youtubeId || !category || !level) {
  console.error('Usage: node scripts/addVideo.mjs <youtubeId> <category> <level>');
  process.exit(1);
}

// Fetch video metadata from YouTube Data API
const ytRes = await fetch(
  `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${youtubeId}&key=${FIREBASE_API_KEY}`
);
const ytData = await ytRes.json();
const item = ytData.items?.[0];

if (!item) {
  console.error('Video not found on YouTube:', youtubeId);
  process.exit(1);
}

const title = item.snippet.title;

// Convert ISO 8601 duration (PT3M26S) to mm:ss
const iso = item.contentDetails.duration;
const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
const h = parseInt(match[1] ?? 0);
const m = parseInt(match[2] ?? 0);
const s = parseInt(match[3] ?? 0);
const duration = h > 0
  ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  : `${m}:${String(s).padStart(2, '0')}`;

console.log(`Title:    ${title}`);
console.log(`Duration: ${duration}`);
console.log(`Category: ${category}`);
console.log(`Level:    ${level}`);

// Write to Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

await addDoc(collection(db, 'videos'), {
  youtubeId,
  title,
  duration,
  category,
  level,
  createdAt: serverTimestamp(),
});

console.log('✅ Added to Firestore!');
process.exit(0);
