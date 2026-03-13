package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sargy/gridpulse/backend-go/service"
)

type SeriesHandler struct {
	svc *service.SeriesService
}

func NewSeriesHandler(svc *service.SeriesService) *SeriesHandler {
	return &SeriesHandler{svc: svc}
}

// GetSeries handles GET /api/series.
func (h *SeriesHandler) GetSeries(w http.ResponseWriter, r *http.Request) {
	series, err := h.svc.GetAllSeries(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(series)
}
