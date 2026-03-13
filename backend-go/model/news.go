package model

// NewsItem is a single news article from an RSS feed (not persisted).
type NewsItem struct {
	Title   string `json:"title"`
	Link    string `json:"link"`
	Summary string `json:"summary"`
	Date    string `json:"date"`
	Badge   string `json:"badge"`
	Label   string `json:"label"`
}
