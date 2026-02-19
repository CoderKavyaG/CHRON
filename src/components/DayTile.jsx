import { LEGEND_CONFIG, DEFAULT_COLOR, DEFAULT_TEXT_COLOR } from '../lib/constants';
import { isToday, isFuture, formatShortDate } from '../lib/dateUtils';

export default function DayTile({ day, entry, reviews, onClick }) {
    const today = day.dateKey ? isToday(day.dateKey) : false;
    const future = day.dateKey ? isFuture(day.dateKey) : false;

    const config = entry ? LEGEND_CONFIG[entry.legend] : null;
    const bgColor = config ? config.color : DEFAULT_COLOR;
    const textColor = config ? config.textColor : DEFAULT_TEXT_COLOR;

    if (!day.isValid) {
        return <div className="w-[28px] h-[28px] sm:w-[30px] sm:h-[30px]" />;
    }

    return (
        <button
            onClick={() => !future && onClick(day)}
            disabled={future}
            className={`
        day-tile relative w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] rounded-[4px] flex items-center justify-center
        text-[10px] font-medium cursor-pointer select-none
        ${future ? 'opacity-30 cursor-not-allowed' : ''}
        ${today ? 'ring-1 ring-cyan-400 ring-offset-1 ring-offset-background' : ''}
      `}
            style={{ backgroundColor: bgColor, color: textColor }}
            title={day.dateKey ? formatShortDate(day.dateKey) : ''}
        >
            {day.dayNumber}
        </button>
    );
}
