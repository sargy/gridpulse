package repository

import (
	"context"

	"github.com/sargy/gridpulse/backend-go/model"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type TranslationRepository struct {
	col *mongo.Collection
}

func NewTranslationRepository(db *mongo.Database) *TranslationRepository {
	return &TranslationRepository{col: db.Collection("translations")}
}

func (r *TranslationRepository) FindByLang(ctx context.Context, lang string) (*model.Translation, error) {
	var t model.Translation
	err := r.col.FindOne(ctx, bson.D{{Key: "lang", Value: lang}}).Decode(&t)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TranslationRepository) Count(ctx context.Context) (int64, error) {
	return r.col.CountDocuments(ctx, bson.D{})
}

func (r *TranslationRepository) InsertOne(ctx context.Context, t model.Translation) error {
	_, err := r.col.InsertOne(ctx, t)
	return err
}
