package com.gridpulse.api.controller;

import com.gridpulse.api.model.Race;
import com.gridpulse.api.service.RaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {

    private final RaceService raceService;

    public RaceController(RaceService raceService) {
        this.raceService = raceService;
    }

    @GetMapping
    public List<Race> getRaces(@RequestParam(required = false) String series) {
        if (series != null && !series.isBlank()) {
            return raceService.getRacesBySeries(series);
        }
        return raceService.getAllRaces();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Race> getRaceById(@PathVariable String id) {
        return raceService.getRaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
