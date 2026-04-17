package com.gridpulse.api.controller;

import com.gridpulse.api.service.TranslationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/translations")
@Tag(name = "Translations", description = "Internationalization strings")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @GetMapping("/{lang}")
    @Operation(summary = "Get translations", description = "Returns all i18n key-value pairs for the given language code")
    public Map<String, String> getTranslations(
            @Parameter(description = "Language code (e.g. en, fr, es, de, pl, ja, ko)")
            @PathVariable String lang) {
        return translationService.getTranslations(lang);
    }
}
