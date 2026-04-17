package com.gridpulse.api.controller;

import com.gridpulse.api.model.Race;
import com.gridpulse.api.service.RaceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RaceController.class)
class RaceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RaceService raceService;

    private Race createTestRace(String id, String city, List<String> series) {
        Race race = new Race();
        race.setId(id);
        race.setCity(city);
        race.setCountry("Australia");
        race.setRegion("Australian GP");
        race.setRound("1");
        race.setSeries(series);
        race.setTimezone("Australia/Melbourne");
        race.setLat(-37.85);
        race.setLng(144.97);
        race.setSessions(Map.of("race", "2026-03-08T04:00:00Z"));
        return race;
    }

    @Test
    void getAllRaces_returnsRaces() throws Exception {
        Race race = createTestRace("melbourne", "Melbourne", List.of("f1", "f2"));
        when(raceService.getAllRaces()).thenReturn(List.of(race));

        mockMvc.perform(get("/api/races"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].city").value("Melbourne"))
                .andExpect(jsonPath("$[0].series", containsInAnyOrder("f1", "f2")));
    }

    @Test
    void getRacesBySeries_filtersCorrectly() throws Exception {
        Race race = createTestRace("melbourne", "Melbourne", List.of("f1"));
        when(raceService.getRacesBySeries("f1")).thenReturn(List.of(race));

        mockMvc.perform(get("/api/races").param("series", "f1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].series", contains("f1")));
    }

    @Test
    void getRaceById_found() throws Exception {
        Race race = createTestRace("melbourne", "Melbourne", List.of("f1"));
        when(raceService.getRaceById("melbourne")).thenReturn(Optional.of(race));

        mockMvc.perform(get("/api/races/melbourne"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Melbourne"));
    }

    @Test
    void getRaceById_notFound() throws Exception {
        when(raceService.getRaceById("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/races/nonexistent"))
                .andExpect(status().isNotFound());
    }
}
