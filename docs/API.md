# GridPulse API Documentation

REST API for GridPulse motorsport calendar — provides race schedules, series info, news, and translations for F1, F2, F3, F1 Academy, Formula E, IndyCar, WEC, and WRC.

- **Version:** 1.0.0
- **OpenAPI Spec:** [openapi.json](./openapi.json)
- **Live Swagger UI:** [gridpulse.csargy.co.uk/api/docs](https://gridpulse.csargy.co.uk/api/docs)
- **Base URL:** `https://gridpulse.csargy.co.uk`

---

## Endpoints

### Races

#### `GET /api/races`

Returns all races in the calendar, optionally filtered by series.

| Parameter | In    | Type   | Required | Description |
|-----------|-------|--------|----------|-------------|
| `series`  | query | string | No       | Filter by series key (e.g. `f1`, `f2`, `f3`, `fe`, `indy`, `wec`, `wrc`) |

**Response:** `200 OK` — Array of [Race](#race) objects

**Example:**
```
GET /api/races
GET /api/races?series=f1
```

#### `GET /api/races/{id}`

Returns a single race by its MongoDB document ID.

| Parameter | In   | Type   | Required | Description |
|-----------|------|--------|----------|-------------|
| `id`      | path | string | Yes      | Race document ID |

**Response:** `200 OK` — [Race](#race) object

---

### Series

#### `GET /api/series`

Returns all racing series with their display labels, colors, and session types.

**Response:** `200 OK` — Array of [Series](#series) objects

---

### News

#### `GET /api/news`

Returns latest motorsport news aggregated from RSS feeds.

**Response:** `200 OK` — Array of [NewsItem](#newsitem) objects

---

### Translations

#### `GET /api/translations/{lang}`

Returns all i18n key-value pairs for the given language code.

| Parameter | In   | Type   | Required | Description |
|-----------|------|--------|----------|-------------|
| `lang`    | path | string | Yes      | Language code (e.g. `en`, `fr`, `es`, `de`, `pl`, `ja`, `ko`) |

**Response:** `200 OK` — Object with string key-value pairs

---

## Schemas

### Race

| Field         | Type              | Description |
|---------------|-------------------|-------------|
| `id`          | string            | MongoDB document ID |
| `city`        | string            | City where the race takes place |
| `country`     | string            | Country code |
| `region`      | string            | Race name (e.g. "Australian GP") |
| `round`       | string            | Round number in the calendar |
| `series`      | string[]          | Series this race belongs to (e.g. `["f1", "f2", "f3"]`) |
| `timezone`    | string            | IANA timezone (e.g. "Australia/Melbourne") |
| `lat`         | number (double)   | Latitude |
| `lng`         | number (double)   | Longitude |
| `sessions`    | object            | F1 session times — keys are session codes (e.g. `fp1`, `q`, `r`), values are ISO 8601 timestamps |
| `f2Sessions`  | object            | F2 session times |
| `f3Sessions`  | object            | F3 session times |
| `f1aSessions` | object            | F1 Academy session times |
| `feSessions`  | object            | Formula E session times |
| `indySessions`| object            | IndyCar session times |
| `wecSessions` | object            | WEC session times |
| `wrcSessions` | object            | WRC session times |
| `cancelled`   | boolean           | Whether the race has been cancelled |

### Series

| Field          | Type     | Description |
|----------------|----------|-------------|
| `id`           | string   | Series key (e.g. `f1`, `f2`) |
| `label`        | string   | Display name |
| `color`        | string   | Brand color (hex) |
| `sessionTypes` | string[] | Available session type codes |

### NewsItem

| Field     | Type   | Description |
|-----------|--------|-------------|
| `title`   | string | Article headline |
| `link`    | string | URL to the full article |
| `summary` | string | Short description |
| `date`    | string | Publication date |
| `badge`   | string | Source badge (e.g. "F1", "FE") |
| `label`   | string | Source label |
