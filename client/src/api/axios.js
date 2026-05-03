import axios from 'axios';

/* Same origin in both dev (via Vite proxy) and production (Cloud Run serves both).
   No VITE_API_URL injection needed. */
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/* Attach session ID to every request */
api.interceptors.request.use((config) => {
  let sid = localStorage.getItem('eg_session');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('eg_session', sid);
  }
  config.headers['X-Session-Id'] = sid;
  return config;
});

/* Unified error shape */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      (err.code === 'ECONNABORTED' ? 'Request timed out' : 'Network error — is the server running?');
    return Promise.reject(new Error(message));
  }
);

export default api;
