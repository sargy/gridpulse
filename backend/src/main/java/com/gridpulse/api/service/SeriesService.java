package com.gridpulse.api.service;

import com.gridpulse.api.model.Series;
import com.gridpulse.api.repository.SeriesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeriesService {

    private final SeriesRepository seriesRepository;

    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    public List<Series> getAllSeries() {
        return seriesRepository.findAll();
    }

    public long count() {
        return seriesRepository.count();
    }

    public void saveAll(List<Series> seriesList) {
        seriesRepository.saveAll(seriesList);
    }
}
