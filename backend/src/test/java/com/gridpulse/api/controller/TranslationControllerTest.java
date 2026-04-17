package com.gridpulse.api.controller;

import com.gridpulse.api.service.TranslationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TranslationController.class)
class TranslationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TranslationService translationService;

    @Test
    void getTranslations_returnsKeys() throws Exception {
        Map<String, String> keys = Map.of("calendar_title", "2026 Calendar", "all", "All");
        when(translationService.getTranslations("en")).thenReturn(keys);

        mockMvc.perform(get("/api/translations/en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.calendar_title").value("2026 Calendar"))
                .andExpect(jsonPath("$.all").value("All"));
    }

    @Test
    void getTranslations_unknownLang_fallsBack() throws Exception {
        Map<String, String> enKeys = Map.of("all", "All");
        when(translationService.getTranslations("zz")).thenReturn(enKeys);

        mockMvc.perform(get("/api/translations/zz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.all").value("All"));
    }
}
