package com.gridpulse.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI gridPulseOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GridPulse API")
                        .description("REST API for GridPulse motorsport calendar — provides race schedules, series info, news, and translations for F1, F2, F3, F1 Academy, Formula E, IndyCar, WEC, and WRC.")
                        .version("1.0.0")
                        .contact(new Contact().name("GridPulse").url("https://gridpulse.csargy.co.uk")))
                .servers(List.of(
                        new Server().url("/").description("Current server")));
    }
}
