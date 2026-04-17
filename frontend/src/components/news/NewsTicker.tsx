import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../hooks/useNews';
import { Badge } from '../common/Badge';

type NewsFilter = 'all' | 'f1' | 'other';

export function NewsTicker() {
  const { t } = useTranslation();
  const { news, loading } = useNews();
  const [filter, setFilter] = useState<NewsFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return news;
    if (filter === 'f1') return news.filter((n) => n.badge === 'f1');
    return news.filter((n) => n.badge !== 'f1');
  }, [news, filter]);

  if (loading || news.length === 0) return null;

  return (
    <div className="news-bar">
      <div className="news-filter">
        <span className="news-dot">●</span>
        <span className="news-label">{t('news_label', 'NEWS')}</span>
        <span className="news-divider">|</span>
        <button
          className={`news-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('all', 'All')}
        </button>
        <button
          className={`news-filter-btn ${filter === 'f1' ? 'active' : ''}`}
          onClick={() => setFilter('f1')}
        >
          F1
        </button>
        <button
          className={`news-filter-btn ${filter === 'other' ? 'active' : ''}`}
          onClick={() => setFilter('other')}
        >
          {t('news_other', 'Other')}
        </button>
      </div>
      <div className="news-ticker" key={filter}>
        {[...filtered, ...filtered].map((item, i) => (
          <span key={`${item.link}-${i}`}>
            <a
              className="ticker-item"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge series={item.badge} />
              {' '}{item.title}
            </a>
            <span className="ticker-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
