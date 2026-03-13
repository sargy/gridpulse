package service

import (
	"log"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/mmcdole/gofeed"
	"github.com/sargy/gridpulse/backend-go/model"
)

type feedConfig struct {
	URL   string
	Badge string
	Label string
}

var feeds = []feedConfig{
	{"https://www.autosport.com/rss/feed/f1", "f1", "F1"},
	{"https://www.autosport.com/rss/feed/indycar", "indy", "IndyCar"},
	{"https://www.autosport.com/rss/feed/formula-e", "fe", "Formula E"},
	{"https://the-race.com/formula-1/feed/", "f1", "F1"},
	{"https://the-race.com/formula-e/feed/", "fe", "Formula E"},
	{"https://the-race.com/indycar/feed/", "indy", "IndyCar"},
}

var htmlTagRe = regexp.MustCompile(`<[^>]*>`)

// NewsService fetches and caches RSS news from multiple sources.
type NewsService struct {
	mu        sync.Mutex
	cached    []model.NewsItem
	expiresAt time.Time
}

func NewNewsService() *NewsService {
	return &NewsService{}
}

// GetNews returns cached news items, refreshing from RSS feeds if the cache
// has expired (300 second TTL).
func (s *NewsService) GetNews() []model.NewsItem {
	s.mu.Lock()
	if time.Now().Before(s.expiresAt) && s.cached != nil {
		items := s.cached
		s.mu.Unlock()
		return items
	}
	s.mu.Unlock()

	items := s.fetchAll()

	s.mu.Lock()
	s.cached = items
	s.expiresAt = time.Now().Add(300 * time.Second)
	s.mu.Unlock()

	return items
}

func (s *NewsService) fetchAll() []model.NewsItem {
	type result struct {
		items []model.NewsItem
	}

	ch := make(chan result, len(feeds))
	parser := gofeed.NewParser()

	for _, f := range feeds {
		go func(fc feedConfig) {
			feed, err := parser.ParseURL(fc.URL)
			if err != nil {
				log.Printf("WARN: Failed to fetch RSS feed %s: %v", fc.URL, err)
				ch <- result{}
				return
			}
			var items []model.NewsItem
			for _, entry := range feed.Items {
				title := entry.Title
				if title == "" {
					continue
				}
				summary := ""
				if entry.Description != "" {
					summary = strings.TrimSpace(htmlTagRe.ReplaceAllString(entry.Description, ""))
				}
				date := time.Now().UTC().Format(time.RFC3339)
				if entry.PublishedParsed != nil {
					date = entry.PublishedParsed.UTC().Format(time.RFC3339)
				}
				items = append(items, model.NewsItem{
					Title:   title,
					Link:    entry.Link,
					Summary: summary,
					Date:    date,
					Badge:   fc.Badge,
					Label:   fc.Label,
				})
			}
			ch <- result{items: items}
		}(f)
	}

	seen := make(map[string]bool)
	var allItems []model.NewsItem
	for range feeds {
		r := <-ch
		for _, item := range r.items {
			key := strings.ToLower(item.Title)
			if len(key) > 50 {
				key = key[:50]
			}
			if seen[key] {
				continue
			}
			seen[key] = true
			allItems = append(allItems, item)
		}
	}

	// Sort newest first
	sort.Slice(allItems, func(i, j int) bool {
		return allItems[i].Date > allItems[j].Date
	})

	// Limit to 40
	if len(allItems) > 40 {
		allItems = allItems[:40]
	}

	return allItems
}
