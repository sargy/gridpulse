package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sargy/gridpulse/backend-go/service"
)

type NewsHandler struct {
	svc *service.NewsService
}

func NewNewsHandler(svc *service.NewsService) *NewsHandler {
	return &NewsHandler{svc: svc}
}

// GetNews handles GET /api/news.
func (h *NewsHandler) GetNews(w http.ResponseWriter, r *http.Request) {
	items := h.svc.GetNews()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
