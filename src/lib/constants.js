// Mood/Legend types
export const Legend = {
    CORE_MEMORY: 'CORE_MEMORY',
    GOOD_DAY: 'GOOD_DAY',
    NEUTRAL: 'NEUTRAL',
    BAD_DAY: 'BAD_DAY',
    NIGHTMARE: 'NIGHTMARE',
};

export const LEGEND_CONFIG = {
    [Legend.CORE_MEMORY]: {
        label: 'Core Memory',
        color: '#22D3EE',
        textColor: '#083344',
        emoji: '✨',
        description: 'An unforgettable moment',
    },
    [Legend.GOOD_DAY]: {
        label: 'A Good Day',
        color: '#22C55E',
        textColor: '#052e16',
        emoji: '😊',
        description: 'Things went well',
    },
    [Legend.NEUTRAL]: {
        label: 'Neutral',
        color: '#FACC15',
        textColor: '#422006',
        emoji: '😐',
        description: 'Just another day',
    },
    [Legend.BAD_DAY]: {
        label: 'A Bad Day',
        color: '#FB923C',
        textColor: '#431407',
        emoji: '😔',
        description: 'Could have been better',
    },
    [Legend.NIGHTMARE]: {
        label: 'Nightmare',
        color: '#EF4444',
        textColor: '#450a0a',
        emoji: '💀',
        description: 'A difficult day',
    },
};

export const DEFAULT_COLOR = '#2A2B2F';
export const DEFAULT_TEXT_COLOR = '#9CA3AF';

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const MONTHS = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export const FULL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export const QUADRIMESTERS = [
    { name: 'Quadrimester 1', months: [0, 1, 2, 3] },
    { name: 'Quadrimester 2', months: [4, 5, 6, 7] },
    { name: 'Quadrimester 3', months: [8, 9, 10, 11] },
];

export const ReviewCategory = {
    WORK: 'WORK',
    PERSONAL: 'PERSONAL',
    LEARNING: 'LEARNING',
    HEALTH: 'HEALTH',
    CUSTOM: 'CUSTOM',
};

export const DEFAULT_CATEGORIES = [
    { value: ReviewCategory.WORK, label: 'Work', emoji: '💼' },
    { value: ReviewCategory.PERSONAL, label: 'Personal', emoji: '🏠' },
    { value: ReviewCategory.LEARNING, label: 'Learning', emoji: '📚' },
    { value: ReviewCategory.HEALTH, label: 'Health', emoji: '🏃' },
];
