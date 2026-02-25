import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QUADRIMESTERS } from '../lib/constants';
import * as api from '../lib/api';
import toast from 'react-hot-toast';
import MonthGrid from '../components/MonthGrid';
import DayModal from '../components/DayModal';
import UpcomingRibbon from '../components/UpcomingRibbon';
import GoalSidebar from '../components/GoalSidebar';
import { formatDateKey, isFuture } from '../lib/dateUtils';

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
    const today = new Date();
    const todayKey = new Date().toLocaleDateString('sv-SE');
    const [selectedDay, setDay] = useState({
        dateKey: todayKey,
        isValid: true
    });
    const [showModal, setShowModal] = useState(false);
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
                <div className="hero__grid">
                    <div className="hero__left">
                        <h1 className="hero__title hero__title--custom">
                            HEY KAVI, WELCOME TO RUINS
                        </h1>

                        <p className="hero__sub hero__sub--custom">
                            THE YEAR {year} - VISUAL AUTOGRAPHY OF ME AND MY JOURNEY
                        </p>

                        {/* Year progress — only for current year */}
                        {year === currentYear && <YearProgress year={year} />}
                    </div>

                    <div className="hero__right">
                        <GoalSidebar day={selectedDay} allEvents={events} />
                    </div>
                </div>
            </div>

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
                                                onDayClick={(day) => {
                                                    setDay(day);
                                                    const todayKey = new Date().toLocaleDateString('sv-SE');
                                                    if (day.dateKey === todayKey) {
                                                        const hours = new Date().getHours();
                                                        if (hours >= 23) {
                                                            setShowModal(true);
                                                        } else {
                                                            toast('Journaling opens at 11:00 PM', { icon: '🌙' });
                                                            setShowModal(false);
                                                        }
                                                    } else {
                                                        // Past or Future
                                                        setShowModal(true);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* ── Day Modal ───────────────── */}
            {showModal && selectedDay && selectedDay.isValid && (
                <DayModal
                    day={selectedDay}
                    entry={entries[selectedDay.dateKey]}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        fetchData();
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
}
