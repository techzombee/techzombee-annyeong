import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const isNew = getApps().length === 0;
const app = isNew ? initializeApp(firebaseConfig) : getApps()[0];

// initializeAuth must only be called once (when the app is first created).
// On subsequent module evaluations (hot reload), use getAuth instead.
export const auth = (() => {
  if (!isNew || Platform.OS === 'web') return getAuth(app);
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
})();

export const db = getFirestore(app);
