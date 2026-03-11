package com.gridpulse.api.controller;

import com.gridpulse.api.model.Series;
import com.gridpulse.api.service.SeriesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SeriesController.class)
class SeriesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeriesService seriesService;

    @Test
    void getAllSeries_returnsList() throws Exception {
        Series f1 = new Series("f1", "Formula 1", "#ff6060", List.of("fp1", "quali", "race"));
        when(seriesService.getAllSeries()).thenReturn(List.of(f1));

        mockMvc.perform(get("/api/series"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("f1"))
                .andExpect(jsonPath("$[0].label").value("Formula 1"))
                .andExpect(jsonPath("$[0].color").value("#ff6060"));
    }
}
