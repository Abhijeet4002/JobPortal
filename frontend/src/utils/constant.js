// In development, Vite proxy forwards /api to backend (see vite.config.js).
// In production, set VITE_API_BASE to backend URL (e.g. "https://api.example.com/api/v1")
// or leave empty if frontend is served from the same origin as backend.
const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";
export const USER_API_END_POINT = `${API_BASE}/user`;
export const JOB_API_END_POINT = `${API_BASE}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/application`;
export const COMPANY_API_END_POINT = `${API_BASE}/company`;