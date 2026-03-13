package service

import (
	"context"

	"github.com/sargy/gridpulse/backend-go/model"
	"github.com/sargy/gridpulse/backend-go/repository"
)

type RaceService struct {
	repo *repository.RaceRepository
}

func NewRaceService(repo *repository.RaceRepository) *RaceService {
	return &RaceService{repo: repo}
}

func (s *RaceService) GetAllRaces(ctx context.Context) ([]model.Race, error) {
	return s.repo.FindAll(ctx)
}

func (s *RaceService) GetRacesBySeries(ctx context.Context, series string) ([]model.Race, error) {
	return s.repo.FindBySeries(ctx, series)
}

func (s *RaceService) GetRaceByID(ctx context.Context, id string) (*model.Race, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *RaceService) Count(ctx context.Context) (int64, error) {
	return s.repo.Count(ctx)
}

func (s *RaceService) SaveAll(ctx context.Context, races []model.Race) error {
	return s.repo.InsertMany(ctx, races)
}
