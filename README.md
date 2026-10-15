# shrimp-git

A prawn farming web app: a FastAPI backend plus a Next.js frontend. It predicts prawn counts from pond inputs, reads pH/TDS/temperature off a serial-connected IoT sensor, runs disease detection on uploaded prawn photos, and turns all of it into a downloadable PDF consultation report written by Gemini.

## What it does

**Prawn count estimation.** A RandomForest regressor predicts `Prawn_Count` from four inputs: `No_of_Prawns`, `Age_of_Pond`, `Food_Intake`, and `Season`. The model and its label encoder are trained in `backend/model.py` from `backend/Prawndataset.csv` and pickled together into `backend/prawn_model.pkl` (200 trees, `random_state=42`, 80/20 split, scored by mean absolute error). Rows whose `Prawn_Count` is non-numeric (the dataset contains `Cannot Predict`) are dropped before training.

**IoT sensor readings.** `backend/sensor_service.py` opens a serial port at import time and reads comma-separated `pH,TDS,temperature` lines on a background thread, one line per second. If the port cannot be opened it falls back to fixed mock values (pH 8.1, TDS 1200, 28.5 °C), so the app still works without hardware.

**Image disease detection.** `backend/image_service.py` sends an uploaded image to the Roboflow project `shrimp-disease-detection` (version 3, confidence 40, overlap 30) and returns the most frequent detected class as the primary issue, along with the average confidence, the total detection count, and per-class counts.

**PDF diagnosis report.** `POST /diagnosis` combines the ten-question yes/no farmer questionnaire, live sensor readings, and optional image analysis, hands them to Gemini (`gemini-2.0-flash-thinking-exp-01-21`) as an aquaculture-consultant prompt, and returns the result as a PDF. The prompt asks for health assessment, water-quality grading, ranked diagnoses, and specific medications with dosages.

**Count estimation also runs standalone** in `backend/count.py`, which annotates `prawn.jpg` with bounding boxes via `supervision` and writes `annotated_prawn.jpg`.

## Layout

```
backend/                  FastAPI service
  main.py                 app, routes, CORS, uvicorn entry point
  model.py                trains and pickles the regressor
  predict.py              /predict as a standalone router (duplicate of the route in main.py)
  sensor_service.py       serial reader + mock fallback
  image_service.py        Roboflow disease detection
  gemini_service.py       prompt construction + Gemini call
  report_service.py       fpdf2 report rendering
  models.py               DiagnosisRequest pydantic model
  count.py                offline annotated-image demo
  Prawndataset.csv        training data
  prawn_model.pkl         trained model + label encoder
project - Copy/           Next.js 13 app router frontend
  app/page.tsx                    landing dashboard
  app/count-estimation/page.tsx   count form -> /predict
  app/water-quality/page.tsx      sensor readings -> /read_sensor
  app/medicine/page.tsx           questionnaire + image -> /diagnosis PDF
  app/monitoring/page.tsx         charted monitoring view
  app/education/page.tsx          static reference content
  app/settings/page.tsx           settings
  app/api/monitoring/route.ts     simulated sensor feed for the charts
prawn.jpg                 sample image for count.py
```

## Running it

Backend, from `backend/`:

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

`main.py` reads `prawn_model.pkl` at import, so run it from inside `backend/`.

Set `GEMINI_API_KEY` in a `.env` file in `backend/`. Without it the report still generates, with the text "AI analysis unavailable. Please consult with an aquaculture specialist."

Frontend, from `project - Copy/`:

```bash
npm install
npm run dev
```

The frontend calls `http://localhost:8000/predict` and `http://127.0.0.1:8000/read_sensor` and `/diagnosis`, with CORS open to all origins on the backend, so the two can run on their default ports side by side.

## API

| Method | Path | Input | Output |
| --- | --- | --- | --- |
| GET | `/` | — | `{"message": "Prawn Diagnosis API is Running"}` |
| GET | `/read_sensor` | — | `{"pH", "tds", "temperature"}` |
| POST | `/predict` | form: `no_of_prawns`, `age`, `food`, `season` | `{"prediction": "<n.nn>"}` |
| POST | `/diagnose/image` | file `file`; form `confidence` (default 40), `overlap` (default 30) | JSON classification, confidence, detected_count, disease_counts, details |
| POST | `/diagnosis` | form: `q1`…`q10` booleans; optional file `prawn_image` | `application/pdf` attachment `diagnosis_report.pdf` |

The `confidence` and `overlap` form fields on `/diagnose/image` are accepted but not forwarded — `analyze_prawn_image` hardcodes 40 and 30.

## The questionnaire

`q1`–`q10` are booleans, and the same list is duplicated in `report_service.py` and `gemini_service.py`:

1. Is the growth rate good?
2. Is the food intake good?
3. Are the weather conditions good?
4. Is the pond affected by whitegutt previously?
5. Is the plankton growth more or optimal?
6. Are minerals provided 3-4 times every month?
7. Is the estimated count matched with manual count?
8. Are nearby ponds more affected by viruses?
9. Are prawns losing shell at the correct time?
10. Any shell loose cases in pond?

## Known gaps

- **`components/ui/` is missing.** Every page imports shadcn primitives from `@/components/ui/*`, but that directory is not in the repo — `npm run dev` will fail on the missing imports until the shadcn components are generated or restored.
- **Roboflow API keys are hardcoded** in `backend/image_service.py` and `backend/count.py`. Gemini already reads its key from the environment; these two should follow.
- **The serial port is hardcoded** to `COM18` at 115200 baud in `sensor_service.py`.
- `backend.zip` is a checked-in duplicate of the backend tree.
- `backend/predict.py` is never imported by `main.py`, which defines its own copy of the `/predict` route.
- The frontend chart feed at `app/api/monitoring/route.ts` generates random values and does not read the real sensor.
- There are no tests and no training-notebook; `model.py` runs top-level and retrains on every invocation.

## History

Nine commits, 2025-03-10 to 2025-03-14, most of them single large pushes. See `docs/` for the problem and design decisions.