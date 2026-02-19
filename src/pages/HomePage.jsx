import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QUADRIMESTERS } from '../lib/constants';
import { getAllEntries, getAllReviews, getYearStats } from '../lib/storage';
import MonthGrid from '../components/MonthGrid';
import MoodLegend from '../components/MoodLegend';
import DayModal from '../components/DayModal';

export default function HomePage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);

    const entries = useMemo(() => getAllEntries(), [refreshKey]);
    const reviews = useMemo(() => getAllReviews(), [refreshKey]);

    const handleRefresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    const handleDayClick = useCallback((day) => {
        setSelectedDay(day);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedDay(null);
    }, []);

    return (
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-6 sm:py-10">
            {/* Header Section — Left aligned */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-cyan-500/40 text-cyan-400 bg-cyan-500/10">
                        Personal Archivist
                    </span>
                    <span className="text-text-muted text-xs">V 1.0</span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => setYear((y) => y - 1)}
                        className="p-1 rounded hover:bg-surface-raised transition-colors text-text-muted hover:text-text-primary"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        <span className="text-text-muted font-light">THE YEAR </span>
                        <span className="text-cyan-400">{year}</span>
                    </h1>
                    <button
                        onClick={() => setYear((y) => y + 1)}
                        className="p-1 rounded hover:bg-surface-raised transition-colors text-text-muted hover:text-text-primary"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-text-secondary text-sm max-w-md leading-relaxed">
                    A visual autobiography of your emotional journey. Every square holds a
                    memory, every color tells a story.
                </p>
            </div>

            {/* Main content area with mood legend on right */}
            <div className="flex gap-6">
                {/* Left: Calendar grids */}
                <div className="flex-1 min-w-0 space-y-10">
                    {QUADRIMESTERS.map((quad, qi) => (
                        <div
                            key={quad.name}
                            className="animate-slide-up"
                            style={{ animationDelay: `${qi * 80}ms` }}
                        >
                            {/* Quadrimester heading */}
                            <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-4 pb-2 border-b border-border">
                                {quad.name}
                            </h2>

                            {/* 4 months in a row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                                {quad.months.map((monthIndex) => (
                                    <MonthGrid
                                        key={monthIndex}
                                        year={year}
                                        monthIndex={monthIndex}
                                        entries={entries}
                                        reviews={reviews}
                                        onDayClick={handleDayClick}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Mood Legend (sticky) */}
                <div className="hidden lg:block w-48 flex-shrink-0">
                    <div className="sticky top-8">
                        <MoodLegend />
                    </div>
                </div>
            </div>

            {/* Mobile mood legend */}
            <div className="lg:hidden mt-8">
                <MoodLegend />
            </div>

            {/* Day Modal */}
            {selectedDay && (
                <DayModal
                    day={selectedDay}
                    entry={entries[selectedDay.dateKey]}
                    onClose={handleCloseModal}
                    onSave={handleRefresh}
                />
            )}
        </div>
    );
}
