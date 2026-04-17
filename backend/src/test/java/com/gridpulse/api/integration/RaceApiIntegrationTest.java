package com.gridpulse.api.integration;

import com.gridpulse.api.model.Race;
import com.gridpulse.api.repository.RaceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class RaceApiIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:7");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RaceRepository raceRepository;

    @BeforeEach
    void setUp() {
        raceRepository.deleteAll();
        Race race = new Race();
        race.setId("melbourne");
        race.setCity("Melbourne");
        race.setCountry("Australia");
        race.setRegion("Australian GP");
        race.setRound("1");
        race.setSeries(List.of("f1", "f2", "f3"));
        race.setTimezone("Australia/Melbourne");
        race.setLat(-37.85);
        race.setLng(144.97);
        race.setSessions(Map.of("race", "2026-03-08T04:00:00Z"));
        raceRepository.save(race);
    }

    @Test
    void getRaces_returnsFromMongoDB() throws Exception {
        mockMvc.perform(get("/api/races"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].city").value("Melbourne"));
    }

    @Test
    void getRacesBySeries_filters() throws Exception {
        mockMvc.perform(get("/api/races").param("series", "f1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].series", hasItem("f1")));
    }

    @Test
    void getRaceById_works() throws Exception {
        mockMvc.perform(get("/api/races/melbourne"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.region").value("Australian GP"));
    }
}
