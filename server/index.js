require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3009;
const SECRET = process.env.JWT_SECRET || 'archivist_dev_secret_change_me';
const DATA_FILE = path.join(__dirname, 'data.json');

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());

// ── Data helpers ─────────────────────────────────────────────────────────────
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        const init = { entries: {}, reviews: {}, categories: [], settings: { name: 'Kavya' }, goals: {}, events: {} };
        fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2));
        return init;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── Auth middleware ───────────────────────────────────────────────────────────
function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ── Auth routes ───────────────────────────────────────────────────────────────
// POST /api/login  { password }
app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const storedPassword = process.env.PASSWORD;
    if (!storedPassword) return res.status(500).json({ error: 'Server not configured' });

    // Support both plain-text and bcrypt hashed passwords
    let valid = false;
    if (storedPassword.startsWith('$2')) {
        valid = await bcrypt.compare(password, storedPassword);
    } else {
        valid = password === storedPassword;
    }

    if (!valid) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ user: 'kavya' }, SECRET, { expiresIn: '30d' });
    return res.json({ token });
});

// POST /api/hash-password  — utility to hash your password once
app.post('/api/hash-password', async (req, res) => {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    return res.json({ hash });
});

// ── Day entries ───────────────────────────────────────────────────────────────
app.get('/api/days', auth, (req, res) => {
    const data = readData();
    res.json(data.entries);
});

app.post('/api/days', auth, (req, res) => {
    const { dateKey, legend } = req.body;
    if (!dateKey || !legend) return res.status(400).json({ error: 'dateKey and legend required' });
    const data = readData();
    data.entries[dateKey] = {
        id: dateKey, date: dateKey, legend,
        createdAt: data.entries[dateKey]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    writeData(data);
    res.json(data.entries[dateKey]);
});

app.delete('/api/days/:dateKey', auth, (req, res) => {
    const { dateKey } = req.params;
    const data = readData();
    delete data.entries[dateKey];
    delete data.reviews[dateKey];
    writeData(data);
    res.json({ ok: true });
});

// ── Reviews ───────────────────────────────────────────────────────────────────
app.get('/api/reviews', auth, (req, res) => {
    const data = readData();
    res.json(data.reviews);
});

app.get('/api/reviews/:dateKey', auth, (req, res) => {
    const data = readData();
    res.json(data.reviews[req.params.dateKey] || []);
});

app.post('/api/reviews', auth, (req, res) => {
    const { dateKey, category, content } = req.body;
    if (!dateKey || !category || !content) return res.status(400).json({ error: 'Missing fields' });
    const data = readData();
    if (!data.reviews[dateKey]) data.reviews[dateKey] = [];

    const existing = data.reviews[dateKey].findIndex(r => r.category === category);
    const review = {
        id: `${dateKey}-${category}`,
        dayEntryId: dateKey, category, content,
        createdAt: data.reviews[dateKey][existing]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    if (existing >= 0) data.reviews[dateKey][existing] = review;
    else data.reviews[dateKey].push(review);

    writeData(data);
    res.json(review);
});

app.delete('/api/reviews/:dateKey/:category', auth, (req, res) => {
    const { dateKey, category } = req.params;
    const data = readData();
    if (data.reviews[dateKey]) {
        data.reviews[dateKey] = data.reviews[dateKey].filter(r => r.category !== category);
        if (!data.reviews[dateKey].length) delete data.reviews[dateKey];
        writeData(data);
    }
    res.json({ ok: true });
});

// ── Custom categories ─────────────────────────────────────────────────────────
app.get('/api/categories', auth, (req, res) => {
    res.json(readData().categories);
});

app.post('/api/categories', auth, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const data = readData();
    const cat = { id: `cat-${Date.now()}`, name, order: data.categories.length, createdAt: new Date().toISOString() };
    data.categories.push(cat);
    writeData(data);
    res.json(cat);
});

app.delete('/api/categories/:id', auth, (req, res) => {
    const data = readData();
    data.categories = data.categories.filter(c => c.id !== req.params.id);
    writeData(data);
    res.json({ ok: true });
});

// ── Settings ──────────────────────────────────────────────────────────────────
app.get('/api/settings', auth, (req, res) => {
    res.json(readData().settings);
});

app.put('/api/settings', auth, (req, res) => {
    const data = readData();
    data.settings = { ...data.settings, ...req.body };
    writeData(data);
    res.json(data.settings);
});

// ── Export / Import ───────────────────────────────────────────────────────────
app.get('/api/export', auth, (req, res) => {
    res.json(readData());
});

app.post('/api/import', auth, (req, res) => {
    const { entries, reviews, categories, settings } = req.body;
    const data = readData();
    if (entries) data.entries = entries;
    if (reviews) data.reviews = reviews;
    if (categories) data.categories = categories;
    if (settings) data.settings = settings;
    writeData(data);
    res.json({ ok: true });
});

// ── Goals ───────────────────────────────────────────────────────────────────
// GET /api/goals — all goals keyed by dateKey
app.get('/api/goals', auth, (req, res) => {
    const data = readData();
    res.json(data.goals || {});
});

// GET /api/goals/:dateKey — goals for a specific day
app.get('/api/goals/:dateKey', auth, (req, res) => {
    const data = readData();
    res.json((data.goals || {})[req.params.dateKey] || []);
});

// POST /api/goals — create a new goal { dateKey, title }
app.post('/api/goals', auth, (req, res) => {
    const { dateKey, title } = req.body;
    if (!dateKey || !title) return res.status(400).json({ error: 'dateKey and title required' });
    const data = readData();
    if (!data.goals) data.goals = {};
    if (!data.goals[dateKey]) data.goals[dateKey] = [];
    const goal = {
        id: `goal-${dateKey}-${Date.now()}`,
        dateKey, title,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    data.goals[dateKey].push(goal);
    writeData(data);
    res.json(goal);
});

// PUT /api/goals/:id — update a goal { completed?, title? }
app.put('/api/goals/:id', auth, (req, res) => {
    const data = readData();
    if (!data.goals) return res.status(404).json({ error: 'Not found' });
    let updated = null;
    for (const dateKey of Object.keys(data.goals)) {
        const idx = data.goals[dateKey].findIndex(g => g.id === req.params.id);
        if (idx >= 0) {
            data.goals[dateKey][idx] = { ...data.goals[dateKey][idx], ...req.body, updatedAt: new Date().toISOString() };
            updated = data.goals[dateKey][idx];
            break;
        }
    }
    if (!updated) return res.status(404).json({ error: 'Goal not found' });
    writeData(data);
    res.json(updated);
});

// DELETE /api/goals/:id
app.delete('/api/goals/:id', auth, (req, res) => {
    const data = readData();
    if (!data.goals) return res.json({ ok: true });
    for (const dateKey of Object.keys(data.goals)) {
        const before = data.goals[dateKey].length;
        data.goals[dateKey] = data.goals[dateKey].filter(g => g.id !== req.params.id);
        if (!data.goals[dateKey].length) delete data.goals[dateKey];
        if (data.goals[dateKey]?.length !== before || !data.goals[dateKey]) break;
    }
    writeData(data);
    res.json({ ok: true });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  🗂  Archivist API running at http://localhost:${PORT}\n`);
});
