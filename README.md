# VentRec

**VentRec** is a dark-themed, browser-based audio vent recorder. It records your voice at low quality to save Google Drive space, uploads the recording automatically to a Google Drive folder via Google Apps Script, and logs every session to a Supabase database.

---

## Features

- One-click audio recording with live waveform visualization
- **Low-quality audio** (32 kbps / 16 kHz) to minimise Google Drive storage usage
- Automatic upload to a Google Drive folder after recording stops
- Session logging to a Supabase PostgreSQL database (`recordings` table)
- Configurable recording durations: 1 min, 2 min, or 3 min
- Audio playback preview in the browser
- Fully static — no server required; runs from any web host or GitHub Pages

---

## Architecture

| Component | Technology |
|---|---|
| Frontend | Vanilla HTML / CSS / JavaScript |
| Audio upload | Google Apps Script (Web App) |
| Session logging | Supabase (PostgreSQL) |
| Hosting | GitHub Pages (or any static host) |

---

## Setup

### 1. Google Drive Folder

1. Open [Google Drive](https://drive.google.com) and create a folder (e.g., `VentRec Recordings`).
2. Open the folder and copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```

### 2. Google Apps Script

1. Go to [https://script.google.com](https://script.google.com) and click **New project**.
2. Delete the default code and paste the contents of `google-apps-script/Code.gs`.
3. Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE` with your actual folder ID.
4. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy the **Web app URL**.

### 3. Configure `index.html`

Open `index.html` and replace the placeholder on this line:

```js
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Paste your Google Apps Script deployment URL.

### 4. Supabase (already configured)

The Supabase project **ventrec** is already set up and connected. The `recordings` table stores:

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `session_id` | TEXT | Unique session identifier |
| `filename` | TEXT | Recording filename |
| `duration_seconds` | INTEGER | Recording duration |
| `file_size_bytes` | BIGINT | File size in bytes |
| `mime_type` | TEXT | Audio MIME type |
| `drive_file_id` | TEXT | Google Drive file ID |
| `drive_file_url` | TEXT | Google Drive file URL |
| `status` | TEXT | `pending`, `uploading`, `uploaded`, `upload_failed` |
| `created_at` | TIMESTAMPTZ | Timestamp |
| `updated_at` | TIMESTAMPTZ | Last updated |

### 5. Deploy to GitHub Pages

```bash
# Push to GitHub (already done)
git push origin main

# Enable GitHub Pages:
# Go to https://github.com/ejohnsonbda/ventrec
# Settings → Pages → Source: main branch / root
```

---

## Audio Quality Settings

VentRec uses **low-quality audio** by default to save Google Drive space:

| Setting | Value | Notes |
|---|---|---|
| Bitrate | 32 kbps | vs. default 128 kbps |
| Sample rate | 16 kHz | vs. default 44.1 kHz |
| Codec | Opus (WebM) | Best compression at low bitrates |

A 3-minute recording at these settings is approximately **720 KB** (vs. ~2.9 MB at standard quality).

---

## File Structure

```
ventrec/
├── index.html                  # Main app
├── google-apps-script/
│   └── Code.gs                 # Google Apps Script for Drive upload
└── README.md                   # This file
```

---

## Supabase Project

- **Project name:** ventrec
- **Region:** us-east-1
- **URL:** https://ogabwaekaeinyduntwmt.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/ogabwaekaeinyduntwmt
