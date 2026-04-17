package com.gridpulse.api.seed;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gridpulse.api.model.Race;
import com.gridpulse.api.model.Series;
import com.gridpulse.api.model.Translation;
import com.gridpulse.api.service.RaceService;
import com.gridpulse.api.service.SeriesService;
import com.gridpulse.api.service.TranslationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String[] LANGUAGES = {"en", "fr", "es", "de", "pl", "ja", "ko"};

    private final RaceService raceService;
    private final SeriesService seriesService;
    private final TranslationService translationService;
    private final ObjectMapper objectMapper;

    public DataSeeder(RaceService raceService, SeriesService seriesService,
                      TranslationService translationService, ObjectMapper objectMapper) {
        this.raceService = raceService;
        this.seriesService = seriesService;
        this.translationService = translationService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        seedRaces();
        seedSeries();
        seedTranslations();
    }

    private void seedRaces() throws Exception {
        if (raceService.count() > 0) {
            log.info("Races already seeded ({} records), skipping.", raceService.count());
            return;
        }
        try (InputStream is = new ClassPathResource("seed/races.json").getInputStream()) {
            List<Race> races = objectMapper.readValue(is, new TypeReference<>() {});
            raceService.saveAll(races);
            log.info("Seeded {} races.", races.size());
        }
    }

    private void seedSeries() throws Exception {
        if (seriesService.count() > 0) {
            log.info("Series already seeded ({} records), skipping.", seriesService.count());
            return;
        }
        try (InputStream is = new ClassPathResource("seed/series.json").getInputStream()) {
            List<Series> seriesList = objectMapper.readValue(is, new TypeReference<>() {});
            seriesService.saveAll(seriesList);
            log.info("Seeded {} series.", seriesList.size());
        }
    }

    private void seedTranslations() throws Exception {
        if (translationService.count() > 0) {
            log.info("Translations already seeded, skipping.");
            return;
        }
        for (String lang : LANGUAGES) {
            try (InputStream is = new ClassPathResource("seed/translations/" + lang + ".json").getInputStream()) {
                Map<String, String> keys = objectMapper.readValue(is, new TypeReference<>() {});
                translationService.save(new Translation(lang, keys));
                log.info("Seeded translations for '{}' ({} keys).", lang, keys.size());
            }
        }
    }
}
