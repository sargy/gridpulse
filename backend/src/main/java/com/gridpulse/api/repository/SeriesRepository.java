package com.gridpulse.api.repository;

import com.gridpulse.api.model.Series;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SeriesRepository extends MongoRepository<Series, String> {
}
