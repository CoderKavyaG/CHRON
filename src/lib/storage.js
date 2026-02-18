// localStorage-based storage for the personal journal
// No backend needed — all data lives in your browser

const STORAGE_KEYS = {
    ENTRIES: 'archivist_entries',
    REVIEWS: 'archivist_reviews',
    CUSTOM_CATEGORIES: 'archivist_categories',
    SETTINGS: 'archivist_settings',
};

function getItem(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Failed to save data:', e);
    }
}

// ===== Day Entries =====

export function getAllEntries() {
    return getItem(STORAGE_KEYS.ENTRIES) || {};
}

export function getEntry(dateKey) {
    const entries = getAllEntries();
    return entries[dateKey] || null;
}

export function saveEntry(dateKey, legend) {
    const entries = getAllEntries();
    entries[dateKey] = {
        id: dateKey,
        date: dateKey,
        legend,
        createdAt: entries[dateKey]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.ENTRIES, entries);
    return entries[dateKey];
}

export function deleteEntry(dateKey) {
    const entries = getAllEntries();
    delete entries[dateKey];
    setItem(STORAGE_KEYS.ENTRIES, entries);
    // Also delete associated reviews
    deleteReviewsForDay(dateKey);
}

// ===== Reviews =====

export function getAllReviews() {
    return getItem(STORAGE_KEYS.REVIEWS) || {};
}

export function getReviewsForDay(dateKey) {
    const reviews = getAllReviews();
    return reviews[dateKey] || [];
}

export function saveReview(dateKey, category, content) {
    const reviews = getAllReviews();
    if (!reviews[dateKey]) reviews[dateKey] = [];

    const review = {
        id: `${dateKey}-${category}-${Date.now()}`,
        dayEntryId: dateKey,
        category,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Replace existing review for same category or add new
    const existingIdx = reviews[dateKey].findIndex(r => r.category === category);
    if (existingIdx >= 0) {
        reviews[dateKey][existingIdx] = { ...reviews[dateKey][existingIdx], content, updatedAt: new Date().toISOString() };
    } else {
        reviews[dateKey].push(review);
    }

    setItem(STORAGE_KEYS.REVIEWS, reviews);
    return review;
}

export function deleteReview(dateKey, reviewId) {
    const reviews = getAllReviews();
    if (reviews[dateKey]) {
        reviews[dateKey] = reviews[dateKey].filter(r => r.id !== reviewId);
        if (reviews[dateKey].length === 0) delete reviews[dateKey];
        setItem(STORAGE_KEYS.REVIEWS, reviews);
    }
}

export function deleteReviewsForDay(dateKey) {
    const reviews = getAllReviews();
    delete reviews[dateKey];
    setItem(STORAGE_KEYS.REVIEWS, reviews);
}

// ===== Custom Categories =====

export function getCustomCategories() {
    return getItem(STORAGE_KEYS.CUSTOM_CATEGORIES) || [];
}

export function addCustomCategory(name) {
    const categories = getCustomCategories();
    const cat = {
        id: `custom-${Date.now()}`,
        name,
        order: categories.length,
        createdAt: new Date().toISOString(),
    };
    categories.push(cat);
    setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, categories);
    return cat;
}

export function removeCustomCategory(id) {
    const categories = getCustomCategories().filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, categories);
}

// ===== Settings =====

export function getSettings() {
    return getItem(STORAGE_KEYS.SETTINGS) || {
        name: 'Kavya',
        showStats: true,
    };
}

export function saveSettings(settings) {
    setItem(STORAGE_KEYS.SETTINGS, settings);
}

// ===== Stats =====

export function getYearStats(year) {
    const entries = getAllEntries();
    const stats = {
        total: 0,
        coreMomory: 0,
        goodDay: 0,
        neutral: 0,
        badDay: 0,
        nightmare: 0,
        streakCurrent: 0,
        streakLongest: 0,
    };

    const yearEntries = Object.values(entries).filter(e => e.date.startsWith(String(year)));
    stats.total = yearEntries.length;

    yearEntries.forEach(e => {
        switch (e.legend) {
            case 'CORE_MEMORY': stats.coreMomory++; break;
            case 'GOOD_DAY': stats.goodDay++; break;
            case 'NEUTRAL': stats.neutral++; break;
            case 'BAD_DAY': stats.badDay++; break;
            case 'NIGHTMARE': stats.nightmare++; break;
        }
    });

    // Calculate streaks
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort entries by date
    const sortedDates = yearEntries.map(e => e.date).sort();

    for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
            tempStreak = 1;
        } else {
            const prev = new Date(sortedDates[i - 1]);
            const curr = new Date(sortedDates[i]);
            const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Current streak (from today backwards)
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    let checkDate = new Date(today);
    while (entries[`${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    stats.streakCurrent = currentStreak;
    stats.streakLongest = longestStreak;

    return stats;
}

// ===== Export/Import =====

export function exportData() {
    return {
        entries: getAllEntries(),
        reviews: getAllReviews(),
        customCategories: getCustomCategories(),
        settings: getSettings(),
        exportedAt: new Date().toISOString(),
    };
}

export function importData(data) {
    if (data.entries) setItem(STORAGE_KEYS.ENTRIES, data.entries);
    if (data.reviews) setItem(STORAGE_KEYS.REVIEWS, data.reviews);
    if (data.customCategories) setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, data.customCategories);
    if (data.settings) setItem(STORAGE_KEYS.SETTINGS, data.settings);
}
