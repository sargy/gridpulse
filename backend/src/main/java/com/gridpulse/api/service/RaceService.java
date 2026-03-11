package com.gridpulse.api.service;

import com.gridpulse.api.model.Race;
import com.gridpulse.api.repository.RaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RaceService {

    private final RaceRepository raceRepository;

    public RaceService(RaceRepository raceRepository) {
        this.raceRepository = raceRepository;
    }

    public List<Race> getAllRaces() {
        return raceRepository.findAll();
    }

    public List<Race> getRacesBySeries(String series) {
        return raceRepository.findBySeriesContaining(series);
    }

    public Optional<Race> getRaceById(String id) {
        return raceRepository.findById(id);
    }

    public long count() {
        return raceRepository.count();
    }

    public void saveAll(List<Race> races) {
        raceRepository.saveAll(races);
    }
}
