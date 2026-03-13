package main

import (
	"context"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/sargy/gridpulse/backend-go/config"
	"github.com/sargy/gridpulse/backend-go/handler"
	"github.com/sargy/gridpulse/backend-go/repository"
	"github.com/sargy/gridpulse/backend-go/seed"
	"github.com/sargy/gridpulse/backend-go/service"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	cfg := config.Load()

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	// Extract database name from URI or default to "gridpulse"
	dbName := "gridpulse"
	if idx := strings.LastIndex(cfg.MongoURI, "/"); idx != -1 {
		candidate := cfg.MongoURI[idx+1:]
		if qmark := strings.Index(candidate, "?"); qmark != -1 {
			candidate = candidate[:qmark]
		}
		if candidate != "" {
			dbName = candidate
		}
	}
	db := client.Database(dbName)

	// Repositories
	raceRepo := repository.NewRaceRepository(db)
	seriesRepo := repository.NewSeriesRepository(db)
	translationRepo := repository.NewTranslationRepository(db)

	// Services
	raceSvc := service.NewRaceService(raceRepo)
	seriesSvc := service.NewSeriesService(seriesRepo)
	translationSvc := service.NewTranslationService(translationRepo)
	newsSvc := service.NewNewsService()

	// Seed data
	if err := seed.Run(ctx, raceSvc, seriesSvc, translationSvc); err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}

	// Handlers
	raceHandler := handler.NewRaceHandler(raceSvc)
	seriesHandler := handler.NewSeriesHandler(seriesSvc)
	translationHandler := handler.NewTranslationHandler(translationSvc)
	newsHandler := handler.NewNewsHandler(newsSvc)

	// Routes
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/races", raceHandler.GetRaces)
	mux.HandleFunc("GET /api/races/{id}", raceHandler.GetRaceByID)
	mux.HandleFunc("GET /api/series", seriesHandler.GetSeries)
	mux.HandleFunc("GET /api/translations/{lang}", translationHandler.GetTranslations)
	mux.HandleFunc("GET /api/news", newsHandler.GetNews)

	// CORS middleware wrapping the mux
	corsHandler := corsMiddleware(mux)

	log.Printf("GridPulse Go backend starting on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, corsHandler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// corsMiddleware adds CORS headers matching the Java backend's configuration.
func corsMiddleware(next http.Handler) http.Handler {
	allowedOrigins := map[string]bool{
		"http://localhost:3000": true,
		"http://localhost:5173": true,
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET")
			w.Header().Set("Access-Control-Allow-Headers", "*")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
