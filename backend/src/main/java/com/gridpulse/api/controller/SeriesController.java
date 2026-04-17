package com.gridpulse.api.controller;

import com.gridpulse.api.model.Series;
import com.gridpulse.api.service.SeriesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/series")
@Tag(name = "Series", description = "Racing series metadata")
public class SeriesController {

    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @GetMapping
    @Operation(summary = "Get all series", description = "Returns all racing series with their display labels, colors, and session types")
    public List<Series> getAllSeries() {
        return seriesService.getAllSeries();
    }
}
