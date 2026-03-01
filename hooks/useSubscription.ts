import { useEffect, useState } from 'react';
import { hasPremium } from '@/lib/revenuecat';

export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hasPremium()
      .then(setIsPremium)
      .catch(() => setIsPremium(false))
      .finally(() => setLoading(false));
  }, []);

  return { isPremium, loading };
}
