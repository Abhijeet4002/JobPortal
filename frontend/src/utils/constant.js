// Both local (Vite proxy) and production (served from backend) use relative paths.
// No VITE_API_URL needed — the backend serves the frontend in production.
const API_BASE = "/api/v1";
export const USER_API_END_POINT = `${API_BASE}/user`;
export const JOB_API_END_POINT = `${API_BASE}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/application`;
export const COMPANY_API_END_POINT = `${API_BASE}/company`;
