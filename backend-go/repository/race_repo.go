package repository

import (
	"context"

	"github.com/sargy/gridpulse/backend-go/model"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type RaceRepository struct {
	col *mongo.Collection
}

func NewRaceRepository(db *mongo.Database) *RaceRepository {
	return &RaceRepository{col: db.Collection("races")}
}

func (r *RaceRepository) FindAll(ctx context.Context) ([]model.Race, error) {
	cursor, err := r.col.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var races []model.Race
	if err := cursor.All(ctx, &races); err != nil {
		return nil, err
	}
	return races, nil
}

func (r *RaceRepository) FindBySeries(ctx context.Context, series string) ([]model.Race, error) {
	cursor, err := r.col.Find(ctx, bson.D{{Key: "series", Value: series}})
	if err != nil {
		return nil, err
	}
	var races []model.Race
	if err := cursor.All(ctx, &races); err != nil {
		return nil, err
	}
	return races, nil
}

func (r *RaceRepository) FindByID(ctx context.Context, id string) (*model.Race, error) {
	var race model.Race
	err := r.col.FindOne(ctx, bson.D{{Key: "_id", Value: id}}).Decode(&race)
	if err != nil {
		return nil, err
	}
	return &race, nil
}

func (r *RaceRepository) Count(ctx context.Context) (int64, error) {
	return r.col.CountDocuments(ctx, bson.D{})
}

func (r *RaceRepository) InsertMany(ctx context.Context, races []model.Race) error {
	docs := make([]interface{}, len(races))
	for i, race := range races {
		docs[i] = race
	}
	_, err := r.col.InsertMany(ctx, docs)
	return err
}
