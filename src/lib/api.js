import { db, auth } from './firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';

// ── Auth Logic ───────────────────────────────────
export async function signUp(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
}

export async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export async function logout() {
    await signOut(auth);
}

// ── Helpers ──────────────────────────────────────
const getUserCol = (colName) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');
    return collection(db, 'users', uid, colName);
};

const getUserDoc = (colName, id) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');
    return doc(db, 'users', uid, colName, id);
};

// ── Days ──────────────────────────────────────────────────────────────────────
export const getDays = async () => {
    const snap = await getDocs(getUserCol('days'));
    const data = {};
    snap.forEach(d => { data[d.id] = d.data(); });
    return data;
};

export const saveDay = async (dateKey, legend) => {
    const dayRef = getUserDoc('days', dateKey);
    const dayData = {
        id: dateKey, date: dateKey, legend,
        updatedAt: new Date().toISOString(),
    };
    await setDoc(dayRef, dayData, { merge: true });
    return dayData;
};

export const deleteDay = async (dateKey) => {
    await deleteDoc(getUserDoc('days', dateKey));
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews = async () => {
    const snap = await getDocs(getUserCol('reviews'));
    const data = {};
    snap.forEach(d => { data[d.id] = d.data(); });
    return data;
};

export const saveReview = async (dateKey, category, content) => {
    const id = `${dateKey}-${category}`;
    const reviewRef = getUserDoc('reviews', id);
    const review = {
        id, dayEntryId: dateKey, category, content,
        updatedAt: new Date().toISOString(),
    };
    await setDoc(reviewRef, review);
    return review;
};

export const deleteReview = async (dateKey, category) => {
    await deleteDoc(getUserDoc('reviews', `${dateKey}-${category}`));
};

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = async () => {
    const snap = await getDocs(getUserCol('categories'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addCategory = async (name) => {
    const id = `cat-${Date.now()}`;
    const data = { name, order: 0, createdAt: new Date().toISOString() };
    await setDoc(getUserDoc('categories', id), data);
    return { id, ...data };
};

export const removeCategory = async (id) => {
    await deleteDoc(getUserDoc('categories', id));
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const getSettings = async () => {
    const snap = await getDoc(getUserDoc('settings', 'global'));
    return snap.exists() ? snap.data() : { name: auth.currentUser?.displayName || 'Adventurer' };
};

export const saveSettings = async (data) => {
    await setDoc(getUserDoc('settings', 'global'), data, { merge: true });
    return data;
};

// ── Goals ─────────────────────────────────────────────────────────────────────
export const getAllGoals = async () => {
    const snap = await getDocs(getUserCol('goals'));
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
    await setDoc(getUserDoc('goals', id), goal);
    return { id, ...goal };
};

export const updateGoal = async (id, updates) => {
    await updateDoc(getUserDoc('goals', id), { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteGoal = async (id) => {
    await deleteDoc(getUserDoc('goals', id));
};

// ── Events ────────────────────────────────────────────────────────────────────
export const getAllEvents = async () => {
    const snap = await getDocs(getUserCol('events'));
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
    await setDoc(getUserDoc('events', id), evt);
    return { id, ...evt };
};

export const updateEvent = async (id, updates) => {
    await updateDoc(getUserDoc('events', id), { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteEvent = async (id) => {
    await deleteDoc(getUserDoc('events', id));
};
