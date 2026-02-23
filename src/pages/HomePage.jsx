import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QUADRIMESTERS } from '../lib/constants';
import * as api from '../lib/api';
import MonthGrid from '../components/MonthGrid';
import MoodLegend from '../components/MoodLegend';
import DayModal from '../components/DayModal';
import StatsRibbon from '../components/StatsRibbon';
import UpcomingRibbon from '../components/UpcomingRibbon';

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

    return (
        <div className="page-home">
            {/* Hero */}
            <div className="hero anim-fade-in">
                <div className="hero__badge">
                    <span className="hero__tag">Personal Archivist</span>
                    <span className="hero__version">V 1.0</span>
                </div>
                <h1 className="hero__title">
                    <button className="hero__nav-btn" onClick={() => setYear(y => y - 1)}>
                        <ChevronLeft size={15} />
                    </button>
                    <span className="hero__year-muted">THE YEAR&nbsp;</span>
                    <span className="hero__year-accent">{year}</span>
                    <button className="hero__nav-btn" onClick={() => setYear(y => y + 1)}>
                        <ChevronRight size={15} />
                    </button>
                </h1>
                <p className="hero__sub">
                    A visual autobiography of your emotional journey. Every square holds a memory,
                    every color tells a story.
                </p>
            </div>

            {/* Stats + Upcoming — only shown once data is loaded */}
            {!loading && (
                <>
                    <StatsRibbon entries={entries} />
                    <UpcomingRibbon events={events} />
                </>
            )}

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
