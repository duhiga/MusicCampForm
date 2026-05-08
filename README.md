# MusicCampForm

Quaranup Music Camp 2026 application form with a self-hosted Vue frontend and Python backend.

## Included files

- `frontend/index.html`, `frontend/app.js`, `frontend/styles.css` — Vue 3 application using Material Design styling.
- `app.py` — Flask backend that serves the frontend and processes form submissions.
- `requirements.txt` — Python runtime dependencies.
- `Dockerfile` — build instructions for the self-contained container.
- `.env.example` — sample environment configuration.

## Setup

1. Copy `.env.example` to `.env` and fill in your Google Sheets settings.
2. Create or share a Google Sheet and set the target range in the `.env` file. The default range is `FormResponses!A2`.

### Required environment variables

```env
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEETS_RANGE=FormResponses!A2
```

### Optional environment variable

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://example.com/your-apps-script-endpoint
```

If `GOOGLE_SHEETS_WEBHOOK_URL` is set, the backend will send submissions there instead of using the direct Sheets API.

## Build and run with Docker

```bash
docker build -t musiccamp-form .

docker run --rm -p 8080:8080 \
  -e GOOGLE_SHEETS_API_KEY="$GOOGLE_SHEETS_API_KEY" \
  -e GOOGLE_SHEETS_SPREADSHEET_ID="$GOOGLE_SHEETS_SPREADSHEET_ID" \
  musiccamp-form
```

Then open `http://localhost:8080`.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Notes

- This form collects the camp application details and appends one or more rows to the configured Google Sheet.
- The backend is container-ready and serves the frontend from the same Python app.
- If direct Sheets API writes fail because of API-key restrictions, use `GOOGLE_SHEETS_WEBHOOK_URL` and a proxy endpoint that can write to the sheet securely.
