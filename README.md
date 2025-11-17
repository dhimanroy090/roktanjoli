# রক্তাঞ্জলি ব্লাড ব্যাংক (Roktanjoli)

Simple static website for a community blood bank.

## Structure

- `index.html` — main site (Tailwind CDN).
- `js/main.js` — small demo logic for searching donors and contact.
- `assets/logo.svg` — simple logo placeholder.

## How to run

Open `index.html` in your browser. For a local server (recommended):

PowerShell:

```powershell
cd c:\Projects\roktanjoli
python -m http.server 8000; Start-Process "http://localhost:8000"
```

Or using Node (if installed):

```powershell
npx http-server . -p 8000
```

## Notes

- This is a static demo. To make it production-ready, add a backend for donor registration, real database, validation and security.
- If you want, I can:
  - Add more pages or a small REST API server
  - Convert Tailwind to a build pipeline with `postcss` for production
  - Add sample data endpoints
