// In production, VITE_API_URL should point to the Render backend (e.g. https://your-backend.onrender.com)
// In development, the Vite proxy handles /api requests (see vite.config.js)
const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : "/api/v1";
export const USER_API_END_POINT = `${API_BASE}/user`;
export const JOB_API_END_POINT = `${API_BASE}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/application`;
export const COMPANY_API_END_POINT = `${API_BASE}/company`;
