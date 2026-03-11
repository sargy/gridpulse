package com.gridpulse.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class GridPulseApplication {
    public static void main(String[] args) {
        SpringApplication.run(GridPulseApplication.class, args);
    }
}
