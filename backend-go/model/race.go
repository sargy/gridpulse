package model

// Race represents a motorsport event weekend at a specific circuit.
type Race struct {
	ID           string            `bson:"_id"           json:"id"`
	City         string            `bson:"city"          json:"city"`
	Country      string            `bson:"country"       json:"country"`
	Region       string            `bson:"region"        json:"region"`
	Round        any               `bson:"round"         json:"round"`
	Series       []string          `bson:"series"        json:"series"`
	Timezone     string            `bson:"timezone"      json:"timezone"`
	Lat          float64           `bson:"lat"           json:"lat"`
	Lng          float64           `bson:"lng"           json:"lng"`
	Sessions     map[string]string `bson:"sessions"      json:"sessions,omitempty"`
	F2Sessions   map[string]string `bson:"f2Sessions"    json:"f2Sessions,omitempty"`
	F3Sessions   map[string]string `bson:"f3Sessions"    json:"f3Sessions,omitempty"`
	F1aSessions  map[string]string `bson:"f1aSessions"   json:"f1aSessions,omitempty"`
	FeSessions   map[string]string `bson:"feSessions"    json:"feSessions,omitempty"`
	IndySessions map[string]string `bson:"indySessions"  json:"indySessions,omitempty"`
	WecSessions  map[string]string `bson:"wecSessions"   json:"wecSessions,omitempty"`
	WrcSessions  map[string]string `bson:"wrcSessions"   json:"wrcSessions,omitempty"`
}
