import { useMemo } from 'react';
import { MONTHS, WEEKDAYS } from '../lib/constants';
import { generateMonthGridTransposed } from '../lib/dateUtils';
import DayTile from './DayTile';

export default function MonthGrid({ year, monthIndex, entries, reviews, onDayClick }) {
    const grid = useMemo(() => generateMonthGridTransposed(year, monthIndex), [year, monthIndex]);

    return (
        <div className="animate-fade-in">
            {/* Month title */}
            <h4 className="text-text-secondary text-xs font-bold mb-2 tracking-wider uppercase">
                {MONTHS[monthIndex]} {year}
            </h4>

            <div className="flex gap-0">
                {/* Weekday row labels on the left */}
                <div className="flex flex-col gap-[3px] mr-1.5 pt-0">
                    {WEEKDAYS.map((wd) => (
                        <div
                            key={wd}
                            className="h-[28px] sm:h-[30px] flex items-center text-[9px] text-text-muted font-medium leading-none"
                        >
                            {wd}
                        </div>
                    ))}
                </div>

                {/* Transposed grid: each column is a week, each row is a weekday */}
                <div className="flex gap-[3px]">
                    {grid.map((weekCol, colIdx) => (
                        <div key={colIdx} className="flex flex-col gap-[3px]">
                            {weekCol.map((day, rowIdx) => (
                                <DayTile
                                    key={day.dateKey || `empty-${colIdx}-${rowIdx}`}
                                    day={day}
                                    entry={entries[day.dateKey]}
                                    reviews={reviews[day.dateKey]}
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
