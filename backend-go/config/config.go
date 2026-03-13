package config

import "os"

// Config holds application configuration sourced from environment variables.
type Config struct {
	MongoURI string
	Port     string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() Config {
	uri := os.Getenv("SPRING_DATA_MONGODB_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017/gridpulse"
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return Config{MongoURI: uri, Port: port}
}
