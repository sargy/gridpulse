package com.gridpulse.api.model;

public class NewsItem {
    private String title;
    private String link;
    private String summary;
    private String date;
    private String badge;
    private String label;

    public NewsItem() {}

    public NewsItem(String title, String link, String summary, String date, String badge, String label) {
        this.title = title;
        this.link = link;
        this.summary = summary;
        this.date = date;
        this.badge = badge;
        this.label = label;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}
