import { useNews } from '../../hooks/useNews';
import { Badge } from '../common/Badge';

export function NewsTicker() {
  const { news, loading } = useNews();

  if (loading || news.length === 0) return null;

  return (
    <div className="news-bar">
      <div className="news-ticker">
        {[...news, ...news].map((item, i) => (
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
