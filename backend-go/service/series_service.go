package service

import (
	"context"

	"github.com/sargy/gridpulse/backend-go/model"
	"github.com/sargy/gridpulse/backend-go/repository"
)

type SeriesService struct {
	repo *repository.SeriesRepository
}

func NewSeriesService(repo *repository.SeriesRepository) *SeriesService {
	return &SeriesService{repo: repo}
}

func (s *SeriesService) GetAllSeries(ctx context.Context) ([]model.Series, error) {
	return s.repo.FindAll(ctx)
}

func (s *SeriesService) Count(ctx context.Context) (int64, error) {
	return s.repo.Count(ctx)
}

func (s *SeriesService) SaveAll(ctx context.Context, series []model.Series) error {
	return s.repo.InsertMany(ctx, series)
}
