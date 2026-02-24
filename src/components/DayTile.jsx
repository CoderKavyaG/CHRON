import { LEGEND_CONFIG, DEFAULT_COLOR } from '../lib/constants';
import { isToday, isFuture, formatShortDate } from '../lib/dateUtils';

export default function DayTile({ day, entry, hasGoals, hasEvents, onClick }) {
    if (!day.isValid) {
        return <div className="day-tile--empty" />;
    }

    const today = isToday(day.dateKey);
    const future = isFuture(day.dateKey);
    const config = entry ? LEGEND_CONFIG[entry.legend] : null;
    const bg = config ? config.color : DEFAULT_COLOR;
    const color = config ? config.textColor : '#9CA3AF';

    let cls = 'day-tile';
    if (future) cls += ' day-tile--future';
    if (today) cls += ' day-tile--today';
    if (future && (hasGoals || hasEvents)) cls += ' day-tile--future-planned';

    // Tooltip: date + any plan hints
    const hints = [];
    if (hasGoals) hints.push('goals');
    if (hasEvents) hints.push('events');
    const tipExtra = hints.length ? ` · ${hints.join(' & ')}` : (future ? ' · click to plan' : '');
    const tip = formatShortDate(day.dateKey) + tipExtra;

    return (
        <button
            className={cls}
            style={{ backgroundColor: bg, color }}
            onClick={() => onClick(day)}
            title={tip}
        >
            {String(day.dayNumber).padStart(2, '0')}
            {hasGoals && <span className="day-tile__goal-dot" />}
            {hasEvents && <span className="day-tile__event-dot" />}
        </button>
    );
}
