package com.gridpulse.api.controller;

import com.gridpulse.api.model.Race;
import com.gridpulse.api.service.RaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
@Tag(name = "Races", description = "Race schedule and event information")
public class RaceController {

    private final RaceService raceService;

    public RaceController(RaceService raceService) {
        this.raceService = raceService;
    }

    @GetMapping
    @Operation(summary = "Get all races", description = "Returns all races in the calendar, optionally filtered by series")
    public List<Race> getRaces(
            @Parameter(description = "Filter by series key (e.g. f1, f2, f3, fe, indy, wec, wrc)")
            @RequestParam(required = false) String series) {
        if (series != null && !series.isBlank()) {
            return raceService.getRacesBySeries(series);
        }
        return raceService.getAllRaces();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get race by ID", description = "Returns a single race by its MongoDB document ID")
    public ResponseEntity<Race> getRaceById(
            @Parameter(description = "Race document ID") @PathVariable String id) {
        return raceService.getRaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
