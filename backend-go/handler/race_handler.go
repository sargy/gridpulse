package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sargy/gridpulse/backend-go/service"
)

type RaceHandler struct {
	svc *service.RaceService
}

func NewRaceHandler(svc *service.RaceService) *RaceHandler {
	return &RaceHandler{svc: svc}
}

// GetRaces handles GET /api/races with optional ?series= filter.
func (h *RaceHandler) GetRaces(w http.ResponseWriter, r *http.Request) {
	series := r.URL.Query().Get("series")

	var (
		result interface{}
		err    error
	)
	if series != "" {
		result, err = h.svc.GetRacesBySeries(r.Context(), series)
	} else {
		result, err = h.svc.GetAllRaces(r.Context())
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// GetRaceByID handles GET /api/races/{id}.
func (h *RaceHandler) GetRaceByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	race, err := h.svc.GetRaceByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Race not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(race)
}
