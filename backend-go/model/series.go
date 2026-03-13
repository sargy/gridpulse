package model

// Series represents a motorsport championship (e.g. F1, IndyCar).
type Series struct {
	ID           string   `bson:"_id"          json:"id"`
	Label        string   `bson:"label"        json:"label"`
	Color        string   `bson:"color"        json:"color"`
	SessionTypes []string `bson:"sessionTypes" json:"sessionTypes"`
}
