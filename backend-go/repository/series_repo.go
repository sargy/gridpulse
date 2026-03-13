package repository

import (
	"context"

	"github.com/sargy/gridpulse/backend-go/model"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type SeriesRepository struct {
	col *mongo.Collection
}

func NewSeriesRepository(db *mongo.Database) *SeriesRepository {
	return &SeriesRepository{col: db.Collection("series")}
}

func (r *SeriesRepository) FindAll(ctx context.Context) ([]model.Series, error) {
	cursor, err := r.col.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var series []model.Series
	if err := cursor.All(ctx, &series); err != nil {
		return nil, err
	}
	return series, nil
}

func (r *SeriesRepository) Count(ctx context.Context) (int64, error) {
	return r.col.CountDocuments(ctx, bson.D{})
}

func (r *SeriesRepository) InsertMany(ctx context.Context, series []model.Series) error {
	docs := make([]interface{}, len(series))
	for i, s := range series {
		docs[i] = s
	}
	_, err := r.col.InsertMany(ctx, docs)
	return err
}
