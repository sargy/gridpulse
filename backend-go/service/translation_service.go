package service

import (
	"context"

	"github.com/sargy/gridpulse/backend-go/model"
	"github.com/sargy/gridpulse/backend-go/repository"
)

type TranslationService struct {
	repo *repository.TranslationRepository
}

func NewTranslationService(repo *repository.TranslationRepository) *TranslationService {
	return &TranslationService{repo: repo}
}

// GetTranslations returns translation keys for the given language, falling
// back to English if the requested language is not found.
func (s *TranslationService) GetTranslations(ctx context.Context, lang string) (map[string]string, error) {
	t, err := s.repo.FindByLang(ctx, lang)
	if err == nil && t != nil {
		return t.Keys, nil
	}
	// Fallback to English
	t, err = s.repo.FindByLang(ctx, "en")
	if err != nil {
		return map[string]string{}, nil
	}
	return t.Keys, nil
}

func (s *TranslationService) Count(ctx context.Context) (int64, error) {
	return s.repo.Count(ctx)
}

func (s *TranslationService) Save(ctx context.Context, t model.Translation) error {
	return s.repo.InsertOne(ctx, t)
}
