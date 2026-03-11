package com.gridpulse.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "translations")
public class Translation {
    @Id
    private String id;
    private String lang;
    private Map<String, String> keys;

    public Translation() {}

    public Translation(String lang, Map<String, String> keys) {
        this.id = lang;
        this.lang = lang;
        this.keys = keys;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }

    public Map<String, String> getKeys() { return keys; }
    public void setKeys(Map<String, String> keys) { this.keys = keys; }
}
