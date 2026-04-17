package com.gridpulse.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "series")
public class Series {
    @Id
    private String id;
    private String label;
    private String color;
    private List<String> sessionTypes;

    public Series() {}

    public Series(String id, String label, String color, List<String> sessionTypes) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.sessionTypes = sessionTypes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<String> getSessionTypes() { return sessionTypes; }
    public void setSessionTypes(List<String> sessionTypes) { this.sessionTypes = sessionTypes; }
}
