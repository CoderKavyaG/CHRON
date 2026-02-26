import { db, auth } from './firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    updateDoc,
    query,
    where,
    writeBatch
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

export const getReviewsDay = async (dateKey) => {
    const q = query(getUserCol('reviews'), where('dayEntryId', '==', dateKey));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

export const getGoalsDay = async (dateKey) => {
    const q = query(getUserCol('goals'), where('dateKey', '==', dateKey));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addGoal = async (dateKey, title) => {
    const id = `goal-${dateKey}-${Date.now()}`;
    const goal = { dateKey, title, completed: false, createdAt: new Date().toISOString() };
    await setDoc(getUserDoc('goals', id), goal);
    return { id, ...goal };
};

export const updateGoal = async (id, updates) => {
    const goalRef = getUserDoc('goals', id);
    await updateDoc(goalRef, { ...updates, updatedAt: new Date().toISOString() });
    const snap = await getDoc(goalRef);
    return { id: snap.id, ...snap.data() };
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

export const getEventsDay = async (dateKey) => {
    const q = query(getUserCol('events'), where('dateKey', '==', dateKey));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addEvent = async (dateKey, title, desc, color) => {
    const id = `evt-${dateKey}-${Date.now()}`;
    const evt = { dateKey, title, description: desc, color, createdAt: new Date().toISOString() };
    await setDoc(getUserDoc('events', id), evt);
    return { id, ...evt };
};

export const updateEvent = async (id, updates) => {
    const evtRef = getUserDoc('events', id);
    await updateDoc(evtRef, { ...updates, updatedAt: new Date().toISOString() });
    const snap = await getDoc(evtRef);
    return { id: snap.id, ...snap.data() };
};

export const deleteEvent = async (id) => {
    await deleteDoc(getUserDoc('events', id));
};

// ── Data Management (Backup/Restore) ──────────────────────────────────────────
export const exportData = async () => {
    const [days, reviews, categories, settings, goals, events] = await Promise.all([
        getDays(),
        getReviews(),
        getCategories(),
        getSettings(),
        getAllGoals(),
        getAllEvents(),
    ]);

    return {
        entries: days,
        reviews,
        categories,
        settings,
        goals,
        events,
        version: '1.0.0',
        exportedAt: new Date().toISOString()
    };
};

export const importData = async (data) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');

    const batch = writeBatch(db);

    // This is a complex operation in Firestore. For simplicity, we'll just set each document.
    // Note: Firestore batches have a limit of 500 operations.

    // Days
    Object.entries(data.entries || {}).forEach(([id, d]) => {
        batch.set(doc(db, 'users', uid, 'days', id), d);
    });

    // Reviews
    Object.entries(data.reviews || {}).forEach(([id, r]) => {
        batch.set(doc(db, 'users', uid, 'reviews', id), r);
    });

    // Goals (Flat mapping)
    Object.entries(data.goals || {}).forEach(([dk, goals]) => {
        goals.forEach(g => {
            batch.set(doc(db, 'users', uid, 'goals', g.id), g);
        });
    });

    // Events (Flat mapping)
    Object.entries(data.events || {}).forEach(([dk, evts]) => {
        evts.forEach(e => {
            batch.set(doc(db, 'users', uid, 'events', e.id), e);
        });
    });

    // Categories
    (data.categories || []).forEach(c => {
        batch.set(doc(db, 'users', uid, 'categories', c.id), c);
    });

    // Settings
    if (data.settings) {
        batch.set(doc(db, 'users', uid, 'settings', 'global'), data.settings);
    }

    await batch.commit();
};
