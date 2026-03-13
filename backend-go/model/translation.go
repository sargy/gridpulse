package model

// Translation holds all UI translation keys for a single language.
type Translation struct {
	ID   string            `bson:"_id"  json:"id"`
	Lang string            `bson:"lang" json:"lang"`
	Keys map[string]string `bson:"keys" json:"keys"`
}
