# JobPortal — Full-Stack Job Board (React + Node + MongoDB)

A complete job portal with student and recruiter roles. Students can browse jobs and apply with a resume file or link, withdraw and re-apply. Recruiters manage companies, post jobs, view applicants, close/reopen jobs, and download all resumes as a ZIP. Uses JWT cookie auth, MongoDB with Mongoose, Cloudinary for uploads, and a Vite React frontend.

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Express, Mongoose, JWT, bcrypt, multer (memory), Cloudinary

This README gives a high-level view. For deep-dive docs, see the docs/ folder.

## Quick start

Prerequisites: Node.js 18+ (recommended 20+), MongoDB connection string, Cloudinary account.

1) Backend

```powershell
cd backend
npm install
# Copy your environment variables to .env 
npm run dev
```

2) Frontend (runs with a dev proxy to the backend on port 8000)

```powershell
cd frontend
npm install
npm run dev
```


## Environment variables (backend)

- PORT: 8000 (default 3000)
- MONGO_URI: your MongoDB connection string
- JWT_SECRET: secret for JWT signing (fallback: SECRET_KEY)
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: Cloudinary credentials


## Project structure

- backend/ — Express API, models, controllers, routes, auth, uploads
- frontend/ — React app with routes, state, and UI

## Highlights

- Secure auth with httpOnly cookies + CORS configured for Vite dev
- Resume upload to Cloudinary or optional link field
- Recruiter admin: companies, jobs, applicants, close/reopen, ZIP download for resumes
- Student: apply, withdraw, re-apply; “Applied Jobs” view; live job page state updates


