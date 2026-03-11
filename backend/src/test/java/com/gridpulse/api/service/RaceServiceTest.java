package com.gridpulse.api.service;

import com.gridpulse.api.model.Race;
import com.gridpulse.api.repository.RaceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RaceServiceTest {

    @Mock
    private RaceRepository raceRepository;

    @InjectMocks
    private RaceService raceService;

    @Test
    void getAllRaces_delegatesToRepository() {
        Race race = new Race();
        race.setId("melbourne");
        race.setCity("Melbourne");
        when(raceRepository.findAll()).thenReturn(List.of(race));

        List<Race> result = raceService.getAllRaces();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Melbourne");
    }

    @Test
    void getRacesBySeries_filtersCorrectly() {
        Race race = new Race();
        race.setId("melbourne");
        race.setSeries(List.of("f1"));
        when(raceRepository.findBySeriesContaining("f1")).thenReturn(List.of(race));

        List<Race> result = raceService.getRacesBySeries("f1");

        assertThat(result).hasSize(1);
    }

    @Test
    void getRaceById_found() {
        Race race = new Race();
        race.setId("melbourne");
        when(raceRepository.findById("melbourne")).thenReturn(Optional.of(race));

        Optional<Race> result = raceService.getRaceById("melbourne");

        assertThat(result).isPresent();
    }

    @Test
    void getRaceById_notFound() {
        when(raceRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Optional<Race> result = raceService.getRaceById("nonexistent");

        assertThat(result).isEmpty();
    }
}
