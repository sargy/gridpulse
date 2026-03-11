package com.gridpulse.api.service;

import com.gridpulse.api.model.Translation;
import com.gridpulse.api.repository.TranslationRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class TranslationService {

    private final TranslationRepository translationRepository;

    public TranslationService(TranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
    }

    public Map<String, String> getTranslations(String lang) {
        Optional<Translation> translation = translationRepository.findByLang(lang);
        if (translation.isPresent()) {
            return translation.get().getKeys();
        }
        // Fallback to English
        return translationRepository.findByLang("en")
                .map(Translation::getKeys)
                .orElse(Map.of());
    }

    public long count() {
        return translationRepository.count();
    }

    public void save(Translation translation) {
        translationRepository.save(translation);
    }
}
