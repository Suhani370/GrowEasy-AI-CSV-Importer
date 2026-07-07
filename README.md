# GrowEasy AI CSV Importer

An AI-powered CSV importer that intelligently transforms CSV files with arbitrary column names and structures into normalized GrowEasy CRM records.

The application allows users to upload and preview a CSV file before confirming the import. After confirmation, the backend processes records in batches using Gemini AI, validates the structured output, normalizes CRM fields, and skips records without an email address or mobile number.

## Features

- Drag-and-drop CSV upload
- Client-side CSV preview before AI processing
- Responsive table with horizontal and vertical scrolling
- Sticky table headers
- AI-powered intelligent field mapping
- Support for arbitrary CSV column names
- Batch-based AI processing
- Automatic retry for failed AI batches
- Structured JSON responses
- CRM status normalization
- Data source validation
- Phone number and country code extraction
- Invalid record filtering
- Import summary with imported and skipped counts
- Responsive UI
- Loading and error states
- TypeScript across frontend and backend

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Papa Parse
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Multer
- csv-parse
- Zod

### AI

- Google Gemini API
- Structured JSON output
- Prompt-based semantic field mapping

## Project Structure

```text
GrowEasy-AI-CSV-Importer/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── types/
│   └── package.json
│
├── sample-csv/
│   └── test-leads.csv
│
└── README.md
```

## How It Works

1. The user uploads a CSV file.
2. The frontend parses the file locally for preview.
3. No AI request is made during preview.
4. The user confirms the import.
5. The original CSV file is sent to the backend.
6. The backend parses the CSV into records.
7. Records are divided into batches.
8. Gemini AI intelligently maps arbitrary fields into the CRM schema.
9. Zod validates the AI response.
10. The backend normalizes status, data source, and dates.
11. Records without an email and mobile number are skipped.
12. The frontend displays imported records and import statistics.

## CRM Output Fields

The application extracts the following fields when available:

- `created_at`
- `name`
- `email`
- `country_code`
- `mobile_without_country_code`
- `company`
- `city`
- `state`
- `country`
- `lead_owner`
- `crm_status`
- `crm_note`
- `data_source`
- `possession_time`
- `description`

## Allowed CRM Status Values

```text
GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE
```

## Allowed Data Source Values

```text
leads_on_demand
meridian_tower
eden_park
varah_swamy
sarjapur_plots
```

If the AI cannot confidently determine a valid data source, the value is left empty.

## AI Extraction Strategy

The AI prompt is designed to:

- infer semantic relationships between arbitrary CSV headers and CRM fields
- map values such as `Full Name`, `Customer Name`, and `Lead Name` to `name`
- identify phone numbers and separate country codes
- infer CRM statuses from notes and status text
- preserve useful unmatched information in `crm_note`
- avoid inventing unavailable information
- preserve input record order

The backend performs deterministic validation after AI extraction instead of relying only on the model.

## Batch Processing and Retry

CSV records are processed in batches to improve reliability and control request size.

If an AI batch fails, the backend retries the request automatically before returning an error.

## Local Setup

### Prerequisites

- Node.js 18 or later
- npm
- Gemini API key

### Clone the Repository

```bash
git clone https://github.com/Suhani370/GrowEasy-AI-CSV-Importer.git
cd GrowEasy-AI-CSV-Importer
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API Endpoints

### Health Check

```text
GET /api/health
```

### Parse CSV

```text
POST /api/csv/upload
```

Multipart form field:

```text
file
```

### AI CRM Import

```text
POST /api/import/process
```

Multipart form field:

```text
file
```

## Sample Test

A sample CSV is available at:

```text
sample-csv/test-leads.csv
```

The included sample demonstrates:

- arbitrary CSV headers
- intelligent CRM field mapping
- semantic status conversion
- phone country-code separation
- invalid record skipping

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## Security

Environment files containing API keys are excluded from Git using `.gitignore`.

Never commit:

```text
backend/.env
frontend/.env.local
```

## Author

**Suhani Singh Vaishnavi**

GitHub: `Suhani370`