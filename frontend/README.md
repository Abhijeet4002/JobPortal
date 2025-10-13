# Frontend (React + Vite)

## Run locally
```powershell
cd frontend
npm install
npm run dev
```

This app uses a Vite dev proxy to talk to the backend at http://localhost:8000 via the /api path. Cookies are required for auth; axios is configured with `withCredentials`.


