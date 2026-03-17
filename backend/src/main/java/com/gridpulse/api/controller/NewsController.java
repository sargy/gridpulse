package com.gridpulse.api.controller;

import com.gridpulse.api.model.NewsItem;
import com.gridpulse.api.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@Tag(name = "News", description = "Motorsport news from RSS feeds")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    @Operation(summary = "Get news", description = "Returns latest motorsport news aggregated from RSS feeds")
    public List<NewsItem> getNews() {
        return newsService.getNews();
    }
}
