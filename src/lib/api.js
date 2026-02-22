// Frontend API service — talks to the Express backend

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3009';

function getToken() {
    return localStorage.getItem('archivist_token');
}

async function req(method, path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
        localStorage.removeItem('archivist_token');
        window.location.href = '/login';
        return null;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(password) {
    const data = await fetch(`${BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    const json = await data.json();
    if (!data.ok) throw new Error(json.error || 'Login failed');
    localStorage.setItem('archivist_token', json.token);
    return json.token;
}

export function logout() {
    localStorage.removeItem('archivist_token');
}

export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

// ── Days ──────────────────────────────────────────────────────────────────────
export const getDays = () => req('GET', '/api/days');
export const saveDay = (dateKey, legend) => req('POST', '/api/days', { dateKey, legend });
export const deleteDay = (dateKey) => req('DELETE', `/api/days/${dateKey}`);

// ── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews = () => req('GET', '/api/reviews');
export const getReviewsDay = (dateKey) => req('GET', `/api/reviews/${dateKey}`);
export const saveReview = (dateKey, category, content) => req('POST', '/api/reviews', { dateKey, category, content });
export const deleteReview = (dateKey, category) => req('DELETE', `/api/reviews/${dateKey}/${category}`);

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = () => req('GET', '/api/categories');
export const addCategory = (name) => req('POST', '/api/categories', { name });
export const removeCategory = (id) => req('DELETE', `/api/categories/${id}`);

// ── Settings ──────────────────────────────────────────────────────────────────
export const getSettings = () => req('GET', '/api/settings');
export const saveSettings = (data) => req('PUT', '/api/settings', data);

// ── Export / Import ───────────────────────────────────────────────────────────
export const exportData = () => req('GET', '/api/export');
export const importData = (data) => req('POST', '/api/import', data);

// ── Goals ─────────────────────────────────────────────────────────────────────
export const getAllGoals = () => req('GET', '/api/goals');
export const getGoalsDay = (dateKey) => req('GET', `/api/goals/${dateKey}`);
export const addGoal = (dateKey, title) => req('POST', '/api/goals', { dateKey, title });
export const updateGoal = (id, updates) => req('PUT', `/api/goals/${id}`, updates);
export const deleteGoal = (id) => req('DELETE', `/api/goals/${id}`);

// ── Events ────────────────────────────────────────────────────────────────────
export const getAllEvents = () => req('GET', '/api/events');
export const getEventsDay = (dateKey) => req('GET', `/api/events/${dateKey}`);
export const addEvent = (dateKey, title, desc, color) => req('POST', '/api/events', { dateKey, title, description: desc, color });
export const updateEvent = (id, updates) => req('PUT', `/api/events/${id}`, updates);
export const deleteEvent = (id) => req('DELETE', `/api/events/${id}`);
