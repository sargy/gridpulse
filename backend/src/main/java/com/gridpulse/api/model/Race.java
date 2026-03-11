package com.gridpulse.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "races")
public class Race {
    @Id
    private String id;
    private String city;
    private String country;
    private String region;
    private int round;
    private List<String> series;
    private String timezone;
    private double lat;
    private double lng;
    private Map<String, String> sessions;
    private Map<String, String> f2Sessions;
    private Map<String, String> f3Sessions;
    private Map<String, String> f1aSessions;
    private Map<String, String> feSessions;
    private Map<String, String> indySessions;
    private Map<String, String> wecSessions;
    private Map<String, String> wrcSessions;

    public Race() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public int getRound() { return round; }
    public void setRound(int round) { this.round = round; }

    public List<String> getSeries() { return series; }
    public void setSeries(List<String> series) { this.series = series; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public Map<String, String> getSessions() { return sessions; }
    public void setSessions(Map<String, String> sessions) { this.sessions = sessions; }

    public Map<String, String> getF2Sessions() { return f2Sessions; }
    public void setF2Sessions(Map<String, String> f2Sessions) { this.f2Sessions = f2Sessions; }

    public Map<String, String> getF3Sessions() { return f3Sessions; }
    public void setF3Sessions(Map<String, String> f3Sessions) { this.f3Sessions = f3Sessions; }

    public Map<String, String> getF1aSessions() { return f1aSessions; }
    public void setF1aSessions(Map<String, String> f1aSessions) { this.f1aSessions = f1aSessions; }

    public Map<String, String> getFeSessions() { return feSessions; }
    public void setFeSessions(Map<String, String> feSessions) { this.feSessions = feSessions; }

    public Map<String, String> getIndySessions() { return indySessions; }
    public void setIndySessions(Map<String, String> indySessions) { this.indySessions = indySessions; }

    public Map<String, String> getWecSessions() { return wecSessions; }
    public void setWecSessions(Map<String, String> wecSessions) { this.wecSessions = wecSessions; }

    public Map<String, String> getWrcSessions() { return wrcSessions; }
    public void setWrcSessions(Map<String, String> wrcSessions) { this.wrcSessions = wrcSessions; }
}
