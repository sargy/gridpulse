package com.gridpulse.api.repository;

import com.gridpulse.api.model.Race;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RaceRepository extends MongoRepository<Race, String> {
    List<Race> findBySeriesContaining(String series);
}
