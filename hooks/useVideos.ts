import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Video } from '@/components/VideoCard';

export interface CategorySection {
  category: string;
  videos: Video[];
}

export function useVideos() {
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'videos'), orderBy('createdAt', 'desc')))
      .then((snap) => {
        const videos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video));

        // Group by category
        const map: Record<string, Video[]> = {};
        videos.forEach((v) => {
          if (!map[v.category]) map[v.category] = [];
          map[v.category].push(v);
        });

        setSections(Object.entries(map).map(([category, videos]) => ({ category, videos })));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading, error };
}
