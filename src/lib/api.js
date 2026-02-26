import { db } from './firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    updateDoc,
    query,
    where
} from 'firebase/firestore';

function getToken() {
    return localStorage.getItem('archivist_token');
}

// ── Auth Logic (Simplified for Hosting) ───────────────────────────────────
export async function login(password) {
    if (password === 'your_secret_password') { // You can improve this later
        const token = 'authorized';
        localStorage.setItem('archivist_token', token);
        return token;
    }
    throw new Error('Wrong password');
}

export function logout() {
    localStorage.removeItem('archivist_token');
}

export function isAuthenticated() {
    return !!getToken();
}

// ── Days ──────────────────────────────────────────────────────────────────────
export const getDays = async () => {
    const snap = await getDocs(collection(db, 'days'));
    const data = {};
    snap.forEach(d => { data[d.id] = d.data(); });
    return data;
};

export const saveDay = async (dateKey, legend) => {
    const dayRef = doc(db, 'days', dateKey);
    const dayData = {
        id: dateKey, date: dateKey, legend,
        updatedAt: new Date().toISOString(),
    };
    await setDoc(dayRef, dayData, { merge: true });
    return dayData;
};

export const deleteDay = async (dateKey) => {
    await deleteDoc(doc(db, 'days', dateKey));
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews = async () => {
    const snap = await getDocs(collection(db, 'reviews'));
    const data = {};
    snap.forEach(d => { data[d.id] = d.data(); });
    return data;
};

export const saveReview = async (dateKey, category, content) => {
    const id = `${dateKey}-${category}`;
    const reviewRef = doc(db, 'reviews', id);
    const review = {
        id, dayEntryId: dateKey, category, content,
        updatedAt: new Date().toISOString(),
    };
    await setDoc(reviewRef, review);
    return review;
};

export const deleteReview = async (dateKey, category) => {
    await deleteDoc(doc(db, 'reviews', `${dateKey}-${category}`));
};

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = async () => {
    const snap = await getDocs(collection(db, 'categories'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addCategory = async (name) => {
    const id = `cat-${Date.now()}`;
    const data = { name, order: 0, createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'categories', id), data);
    return { id, ...data };
};

export const removeCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const getSettings = async () => {
    const snap = await getDoc(doc(db, 'settings', 'global'));
    return snap.exists() ? snap.data() : { name: 'Kavya' };
};

export const saveSettings = async (data) => {
    await setDoc(doc(db, 'settings', 'global'), data, { merge: true });
    return data;
};

// ── Goals ─────────────────────────────────────────────────────────────────────
export const getAllGoals = async () => {
    const snap = await getDocs(collection(db, 'goals'));
    const data = {};
    snap.forEach(d => {
        const goal = { id: d.id, ...d.data() };
        if (!data[goal.dateKey]) data[goal.dateKey] = [];
        data[goal.dateKey].push(goal);
    });
    return data;
};

export const addGoal = async (dateKey, title) => {
    const id = `goal-${dateKey}-${Date.now()}`;
    const goal = { dateKey, title, completed: false, createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'goals', id), goal);
    return { id, ...goal };
};

export const updateGoal = async (id, updates) => {
    await updateDoc(doc(db, 'goals', id), { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteGoal = async (id) => {
    await deleteDoc(doc(db, 'goals', id));
};

// ── Events ────────────────────────────────────────────────────────────────────
export const getAllEvents = async () => {
    const snap = await getDocs(collection(db, 'events'));
    const data = {};
    snap.forEach(d => {
        const evt = { id: d.id, ...d.data() };
        if (!data[evt.dateKey]) data[evt.dateKey] = [];
        data[evt.dateKey].push(evt);
    });
    return data;
};

export const addEvent = async (dateKey, title, desc, color) => {
    const id = `evt-${dateKey}-${Date.now()}`;
    const evt = { dateKey, title, description: desc, color, createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'events', id), evt);
    return { id, ...evt };
};

export const updateEvent = async (id, updates) => {
    await updateDoc(doc(db, 'events', id), { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteEvent = async (id) => {
    await deleteDoc(doc(db, 'events', id));
};
