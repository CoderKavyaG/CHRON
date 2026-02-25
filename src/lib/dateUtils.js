// Date utility functions

/**
 * Format a date key (YYYY-MM-DD)
 */
export function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Get days in a month
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the weekday of the first day of a month (0 = Monday, 6 = Sunday)
 */
export function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return day === 0 ? 6 : day - 1;
}

/**
 * Check if a date is today
 */
export function isToday(dateKey) {
    const today = new Date();
    return formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()) === dateKey;
}

/**
 * Check if a date is in the future
 */
export function isFuture(dateKey) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date > today;
}

/**
 * Generate day info for a month grid
 */
export function generateMonthDays(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty placeholder days
    for (let i = 0; i < firstDay; i++) {
        days.push({ dateKey: '', dayNumber: 0, weekday: i, isValid: false });
    }

    // Add actual days
    for (let d = 1; d <= daysInMonth; d++) {
        const weekday = (firstDay + d - 1) % 7;
        days.push({
            dateKey: formatDateKey(year, month, d),
            dayNumber: d,
            weekday,
            isValid: true,
        });
    }

    return days;
}

/**
 * Generate a transposed month grid.
 * Returns an array of COLUMNS (weeks), where each column has 7 rows (MON-SUN).
 * This matches the GitHub heatmap / King Diaries layout.
 */
export function generateMonthGridTransposed(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0=MON, 6=SUN

    // Calculate number of weeks needed
    const totalSlots = firstDay + daysInMonth;
    const numWeeks = Math.ceil(totalSlots / 7);

    const columns = [];

    for (let week = 0; week < numWeeks; week++) {
        const col = [];
        for (let weekday = 0; weekday < 7; weekday++) {
            const dayIndex = week * 7 + weekday - firstDay + 1;
            if (dayIndex >= 1 && dayIndex <= daysInMonth) {
                col.push({
                    dateKey: formatDateKey(year, month, dayIndex),
                    dayNumber: dayIndex,
                    weekday,
                    isValid: true,
                });
            } else {
                col.push({ dateKey: '', dayNumber: 0, weekday, isValid: false });
            }
        }
        columns.push(col);
    }

    return columns;
}

/**
 * Format a date string for display
 */
export function formatDisplayDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a short display date
 */
export function formatShortDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}
