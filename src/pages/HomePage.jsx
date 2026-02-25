import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QUADRIMESTERS } from '../lib/constants';
import * as api from '../lib/api';
import MonthGrid from '../components/MonthGrid';
import MoodLegend from '../components/MoodLegend';
import DayModal from '../components/DayModal';
import StatsRibbon from '../components/StatsRibbon';
import UpcomingRibbon from '../components/UpcomingRibbon';

function YearProgress({ year }) {
    const now = new Date();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const pct = Math.round(((now - start) / (end - start)) * 100);
    // Day-of-year
    const dayOfYear = Math.floor((now - start) / 86400000) + 1;
    // Days in this year
    const daysInYear = new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;

    return (
        <div className="year-progress">
            <div className="year-progress__bar">
                <div className="year-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="year-progress__label">
                {pct}% of {year} completed
            </span>
        </div>
    );
}

export default function HomePage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [entries, setEntries] = useState({});
    const [reviews, setReviews] = useState({});
    const [goals, setGoals] = useState({});
    const [events, setEvents] = useState({});
    const [selectedDay, setDay] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [e, r, g, ev] = await Promise.all([
                api.getDays(),
                api.getReviews(),
                api.getAllGoals(),
                api.getAllEvents(),
            ]);
            setEntries(e || {});
            setReviews(r || {});
            setGoals(g || {});
            setEvents(ev || {});
        } catch (err) {
            console.error('Failed to load data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const currentYear = new Date().getFullYear();

    return (
        <div className="page-home">

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <div className="hero anim-fade-in">
                <h1 className="hero__title hero__title--custom">
                    HEY KAVI, WELCOME TO RUINS
                </h1>

                <p className="hero__sub hero__sub--custom">
                    THE YEAR {year} - VISUAL AUTOGRAPHY OF ME AND MY JOURNEY
                </p>

                {/* Year progress — only for current year */}
                {year === currentYear && <YearProgress year={year} />}
            </div>

            {/* ── Stats + Upcoming ─────────────────────────────────────────────── */}
            {!loading && (
                <>
                    <StatsRibbon entries={entries} />
                    <UpcomingRibbon events={events} />
                </>
            )}

            {/* ── Calendar ─────────────────────────────────────────────────────── */}
            {loading ? (
                <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.9rem' }}>
                    Loading your journal…
                </div>
            ) : (
                <>
                    <div className="main-layout">
                        <div className="main-layout__calendar">
                            {QUADRIMESTERS.map((quad, qi) => (
                                <div
                                    key={quad.name}
                                    className="quad-section anim-slide-up"
                                    style={{ animationDelay: `${qi * 80}ms` }}
                                >
                                    <div className="quad-title">{quad.name}</div>
                                    <div className="months-grid">
                                        {quad.months.map(mi => (
                                            <MonthGrid
                                                key={mi}
                                                year={year}
                                                monthIndex={mi}
                                                entries={entries}
                                                reviews={reviews}
                                                goals={goals}
                                                events={events}
                                                onDayClick={setDay}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="main-layout__sidebar">
                            <MoodLegend />
                        </div>
                    </div>
                    <MoodLegend inline />
                </>
            )}

            {/* ── Day Modal ────────────────────────────────────────────────────── */}
            {selectedDay && (
                <DayModal
                    day={selectedDay}
                    entry={entries[selectedDay.dateKey]}
                    onClose={() => setDay(null)}
                    onSave={fetchData}
                />
            )}
        </div>
    );
}
