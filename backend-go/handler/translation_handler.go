package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sargy/gridpulse/backend-go/service"
)

type TranslationHandler struct {
	svc *service.TranslationService
}

func NewTranslationHandler(svc *service.TranslationService) *TranslationHandler {
	return &TranslationHandler{svc: svc}
}

// GetTranslations handles GET /api/translations/{lang}.
func (h *TranslationHandler) GetTranslations(w http.ResponseWriter, r *http.Request) {
	lang := r.PathValue("lang")
	if lang == "" {
		lang = "en"
	}

	keys, err := h.svc.GetTranslations(r.Context(), lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(keys)
}
