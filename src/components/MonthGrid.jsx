import { useMemo } from 'react';
import { MONTHS, WEEKDAYS } from '../lib/constants';
import { generateMonthGridTransposed } from '../lib/dateUtils';
import DayTile from './DayTile';

export default function MonthGrid({ year, monthIndex, entries, reviews, goals, events, onDayClick }) {
    const grid = useMemo(
        () => generateMonthGridTransposed(year, monthIndex),
        [year, monthIndex]
    );

    return (
        <div className="month-block">
            <div className="month-label">
                {MONTHS[monthIndex]} {year}
            </div>

            <div className="cal-grid">
                {/* Weekday row labels */}
                <div className="cal-weekdays">
                    {WEEKDAYS.map((wd) => (
                        <div key={wd} className="cal-wd-label">{wd}</div>
                    ))}
                </div>

                {/* Week columns */}
                <div className="cal-weeks">
                    {grid.map((weekCol, ci) => (
                        <div key={ci} className="cal-week-col">
                            {weekCol.map((day, ri) => (
                                <DayTile
                                    key={day.dateKey || `e-${ci}-${ri}`}
                                    day={day}
                                    entry={entries?.[day.dateKey]}
                                    hasGoals={!!(goals?.[day.dateKey]?.length)}
                                    hasEvents={!!(events?.[day.dateKey]?.length)}
                                    onClick={onDayClick}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
