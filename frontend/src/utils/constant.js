// Use Vite dev server proxy (see vite.config.js) so frontend hits same-origin /api

const API_BASE = import.meta.env.VITE_API_URL + "/api/v1";
export const USER_API_END_POINT = `${API_BASE}/user`;
export const JOB_API_END_POINT = `${API_BASE}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/application`;
export const COMPANY_API_END_POINT = `${API_BASE}/company`;
