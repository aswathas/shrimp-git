# 03 — Decisions

The decisions the code actually makes, with the reasoning visible in it.

## Four independent predictors, one combined report

The app does not pick one technique. It runs a RandomForest regressor for count, a Roboflow detector for disease, a serial reader for water quality, and Gemini for interpretation, then merges them in `report_service.create_pdf_report`.

The reason is visible in the inputs: no single model can answer "is my pond healthy". Count needs pond parameters, disease needs a photo, water needs a sensor, and the recommendation needs all of them in prose. Merging happens late, at PDF-render time, which is why the report degrades cleanly when a section is missing.

## Predict count from pond parameters, not by counting

`RandomForestRegressor` over `No_of_Prawns`, `Age_of_Pond`, `Food_Intake`, `Season` (`backend/model.py`).

Alternatives were a linear model or a direct count. A linear model would not capture the interaction between food intake and pond age. More importantly, the four inputs are what a farmer *already* knows or can estimate in thirty seconds — the model is chosen so its inputs are cheaper than its output.

`n_estimators=200, random_state=42` — pinned so the pickle and the printed MAE match.

## Label-encode Season instead of one-hot

```python
label_encoder = LabelEncoder()
df['Season'] = label_encoder.fit_transform(df['Season'])
```

Ordinary practice is one-hot for a nominal category; label encoding imposes a false ordering on Summer/Autumn/Winter/Monsoon. Done anyway because the encoder is pickled alongside the model, so inference reuses the exact same mapping with a single `transform([season])[0]` call. The trade bought interface simplicity at the cost of correctness.

## Train at module top level, ship the pickle

`backend/model.py` is a script, not a library — it trains, scores and pickles on import. `main.py` and `predict.py` never call it; they load `prawn_model.pkl` directly.

Consequence: retraining means running the script by hand and re-committing the 20 MB artifact, and the repo cannot rebuild the model in CI. The `Cannot Predict` rows are dropped at train time and never reappear.

## Hardcode Roboflow thresholds, read Gemini's key from the environment

`analyze_prawn_image` calls `model.predict(image_path, confidence=40, overlap=30)` with the values inline, ignoring the `confidence` and `overlap` form fields that `/diagnose/image` accepts and defaults. `gemini_service.py` does the opposite: `load_dotenv()` then `os.getenv("GEMINI_API_KEY")`.

There is no stated rationale and the two Roboflow keys are committed to the repo. The inconsistency looks like drift rather than a decision.

## Mock the sensor, don't block on it

`sensor_service.py` tries `COM18` at import. On failure it prints a warning and `get_sensor_data` returns fixed values.

The alternative — refusing to serve without hardware — would make the app undemoable away from a pondside rig. The cost is that the fallback is indistinguishable from a real reading: nothing in the returned dict flags it, and it flows straight into the Gemini prompt, which will comment on it with full seriousness.

## Ask Gemini for the recommendation, not for the diagnosis

`create_prompt` is a structured aquaculture-consultant brief. It hands over the questionnaire, formats sensor readings against their ideal ranges (pH 7.0–8.5, TDS 1000–1500 ppm, 28–32 °C), and asks for five sections ending in specific medication names with dosages. A trailing instruction asks for plain text with no markdown headers, because the output goes straight into `pdf.multi_cell`.

The numerical models stay deterministic and the language model only interprets. That boundary is the load-bearing decision in the whole app.

## Make the PDF the deliverable

`/diagnosis` returns `StreamingResponse` over `io.BytesIO(pdf_bytes)` with `Content-Disposition: attachment`. The farmer gets a document to take to a supplier, not a screen.

`report_service.py` encodes Gemini's text to latin-1 with `errors='replace'` before rendering, because fpdf2's Arial cannot encode arbitrary Unicode. It also keeps a fallback path that emits a two-line PDF if the detailed render throws.

## Build the frontend separately, connect it over HTTP

`05fc78b` "connected with frontend" shows the split. The frontend is a Next.js 13 app-router project with Tailwind and shadcn; the backend is FastAPI on port 8000. They talk over plain HTTP with `allow_origins=["*"]`.

`npm run dev` on the frontend, `uvicorn main:app --port 8000` on the backend, no proxy, no env var for the base URL — `/predict` uses `localhost:8000` while `/read_sensor` and `/diagnosis` use `127.0.0.1:8000`. Both work only because CORS is fully open.

`app/api/monitoring/route.ts` generates its sensor values with `Math.random()` and says so in a comment. The charting half of the app is visibly a stand-in for the serial reader that was added two commits later.