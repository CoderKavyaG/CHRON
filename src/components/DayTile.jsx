import { LEGEND_CONFIG, DEFAULT_COLOR } from '../lib/constants';
import { isToday, isFuture, formatShortDate } from '../lib/dateUtils';

export default function DayTile({ day, entry, onClick }) {
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

    return (
        <button
            className={cls}
            style={{ backgroundColor: bg, color }}
            onClick={() => !future && onClick(day)}
            disabled={future}
            title={formatShortDate(day.dateKey)}
        >
            {String(day.dayNumber).padStart(2, '0')}
        </button>
    );
}
