package com.gridpulse.api.controller;

import com.gridpulse.api.model.NewsItem;
import com.gridpulse.api.service.NewsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NewsController.class)
class NewsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NewsService newsService;

    @Test
    void getNews_returnsList() throws Exception {
        NewsItem item = new NewsItem("Test headline", "https://example.com",
                "Summary text", "2026-03-10T12:00:00Z", "f1", "F1");
        when(newsService.getNews()).thenReturn(List.of(item));

        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Test headline"))
                .andExpect(jsonPath("$[0].badge").value("f1"));
    }
}
