import { useState, useEffect } from 'react';
import type { NewsItem } from '../types';
import { api } from '../api/client';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await api.getNews();
        setNews(data);
      } catch (err) {
        setError('Could not load news feeds.');
        console.error('News fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return { news, loading, error };
}
