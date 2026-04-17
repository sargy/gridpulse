package com.gridpulse.api.repository;

import com.gridpulse.api.model.Translation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TranslationRepository extends MongoRepository<Translation, String> {
    Optional<Translation> findByLang(String lang);
}
