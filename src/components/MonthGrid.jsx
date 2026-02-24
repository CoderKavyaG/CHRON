import { useMemo } from 'react';
import { MONTHS, WEEKDAYS } from '../lib/constants';
import { generateMonthGridTransposed } from '../lib/dateUtils';
import DayTile from './DayTile';

function pad(n) { return String(n).padStart(2, '0'); }

function MonthEventList({ year, monthIndex, events }) {
    const today = new Date().toISOString().slice(0, 10);

    // Collect & sort events belonging to this month that are today or future
    const items = useMemo(() => {
        const prefix = `${year}-${pad(monthIndex + 1)}`;
        const flat = [];
        Object.entries(events || {}).forEach(([dateKey, evts]) => {
            if (dateKey.startsWith(prefix) && dateKey >= today) {
                evts.forEach(e => flat.push({ ...e, dateKey }));
            }
        });
        return flat.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    }, [events, year, monthIndex, today]);

    if (items.length === 0) return null;

    return (
        <div className="month-events">
            {items.map(evt => {
                const d = new Date(evt.dateKey + 'T00:00:00');
                const dayNum = pad(d.getDate());
                const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
                return (
                    <div key={evt.id} className="month-event-item">
                        <span className="month-event-dot" style={{ background: evt.color || '#22D3EE' }} />
                        <span className="month-event-date">{weekDay} {dayNum}</span>
                        <span className="month-event-title">{evt.title}</span>
                    </div>
                );
            })}
        </div>
    );
}

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

            {/* Upcoming events for this month */}
            <MonthEventList year={year} monthIndex={monthIndex} events={events} />
        </div>
    );
}
