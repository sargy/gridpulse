package seed

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"log"

	"github.com/sargy/gridpulse/backend-go/model"
	"github.com/sargy/gridpulse/backend-go/service"
)

//go:embed races.json series.json translations/*.json
var seedFS embed.FS

var languages = []string{"en", "fr", "es", "de", "pl", "ja", "ko"}

// Run seeds the database with race, series, and translation data if the
// collections are empty. This is idempotent — it skips seeding if data
// already exists.
func Run(ctx context.Context, raceSvc *service.RaceService, seriesSvc *service.SeriesService, translationSvc *service.TranslationService) error {
	if err := seedRaces(ctx, raceSvc); err != nil {
		return fmt.Errorf("seed races: %w", err)
	}
	if err := seedSeries(ctx, seriesSvc); err != nil {
		return fmt.Errorf("seed series: %w", err)
	}
	if err := seedTranslations(ctx, translationSvc); err != nil {
		return fmt.Errorf("seed translations: %w", err)
	}
	return nil
}

func seedRaces(ctx context.Context, svc *service.RaceService) error {
	count, err := svc.Count(ctx)
	if err != nil {
		return err
	}
	if count > 0 {
		log.Printf("Races already seeded (%d records), skipping.", count)
		return nil
	}

	data, err := seedFS.ReadFile("races.json")
	if err != nil {
		return err
	}
	var races []model.Race
	if err := json.Unmarshal(data, &races); err != nil {
		return err
	}
	if err := svc.SaveAll(ctx, races); err != nil {
		return err
	}
	log.Printf("Seeded %d races.", len(races))
	return nil
}

func seedSeries(ctx context.Context, svc *service.SeriesService) error {
	count, err := svc.Count(ctx)
	if err != nil {
		return err
	}
	if count > 0 {
		log.Printf("Series already seeded (%d records), skipping.", count)
		return nil
	}

	data, err := seedFS.ReadFile("series.json")
	if err != nil {
		return err
	}
	var series []model.Series
	if err := json.Unmarshal(data, &series); err != nil {
		return err
	}
	if err := svc.SaveAll(ctx, series); err != nil {
		return err
	}
	log.Printf("Seeded %d series.", len(series))
	return nil
}

func seedTranslations(ctx context.Context, svc *service.TranslationService) error {
	count, err := svc.Count(ctx)
	if err != nil {
		return err
	}
	if count > 0 {
		log.Printf("Translations already seeded, skipping.")
		return nil
	}

	for _, lang := range languages {
		data, err := seedFS.ReadFile("translations/" + lang + ".json")
		if err != nil {
			return fmt.Errorf("read %s: %w", lang, err)
		}
		var keys map[string]string
		if err := json.Unmarshal(data, &keys); err != nil {
			return fmt.Errorf("parse %s: %w", lang, err)
		}
		t := model.Translation{
			ID:   lang,
			Lang: lang,
			Keys: keys,
		}
		if err := svc.Save(ctx, t); err != nil {
			return fmt.Errorf("save %s: %w", lang, err)
		}
		log.Printf("Seeded translations for '%s' (%d keys).", lang, len(keys))
	}
	return nil
}
