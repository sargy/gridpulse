package com.gridpulse.api.service;

import com.gridpulse.api.model.NewsItem;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URL;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private static final Logger log = LoggerFactory.getLogger(NewsService.class);

    private record FeedConfig(String url, String badge, String label) {}

    private static final List<FeedConfig> FEEDS = List.of(
            new FeedConfig("https://www.autosport.com/rss/feed/f1", "f1", "F1"),
            new FeedConfig("https://www.autosport.com/rss/feed/indycar", "indy", "IndyCar"),
            new FeedConfig("https://www.autosport.com/rss/feed/formula-e", "fe", "Formula E"),
            new FeedConfig("https://the-race.com/formula-1/feed/", "f1", "F1"),
            new FeedConfig("https://the-race.com/formula-e/feed/", "fe", "Formula E"),
            new FeedConfig("https://the-race.com/indycar/feed/", "indy", "IndyCar")
    );

    @Cacheable("news")
    public List<NewsItem> getNews() {
        List<NewsItem> allItems = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        for (FeedConfig feed : FEEDS) {
            try {
                URL feedUrl = URI.create(feed.url()).toURL();
                SyndFeedInput input = new SyndFeedInput();
                SyndFeed syndFeed = input.build(new XmlReader(feedUrl));

                for (SyndEntry entry : syndFeed.getEntries()) {
                    String title = entry.getTitle();
                    if (title == null || title.isBlank()) continue;

                    String dedupKey = title.toLowerCase().substring(0, Math.min(50, title.length()));
                    if (seen.contains(dedupKey)) continue;
                    seen.add(dedupKey);

                    String summary = "";
                    if (entry.getDescription() != null) {
                        summary = entry.getDescription().getValue()
                                .replaceAll("<[^>]*>", "")
                                .trim();
                    }

                    String date = entry.getPublishedDate() != null
                            ? entry.getPublishedDate().toInstant().toString()
                            : Instant.now().toString();

                    allItems.add(new NewsItem(
                            title,
                            entry.getLink(),
                            summary,
                            date,
                            feed.badge(),
                            feed.label()
                    ));
                }
            } catch (Exception e) {
                log.warn("Failed to fetch RSS feed: {}", feed.url(), e);
            }
        }

        // Sort newest first, limit to 20
        return allItems.stream()
                .sorted(Comparator.comparing(NewsItem::getDate).reversed())
                .limit(20)
                .collect(Collectors.toList());
    }
}
