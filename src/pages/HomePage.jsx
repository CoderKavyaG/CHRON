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

    return (
        <div className="year-progress-full">
            <div className="year-progress-full__fill" style={{ width: `${pct}%` }}>
                <span className="year-progress-full__label">{pct}% OF {year} COMPLETED</span>
            </div>
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
    const [gifUrl, setGifUrl] = useState('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGI2YjY4YjY4YjY4YjY4YjY4YjY4YjY4YjY4YjY4YjYvZW5waGlidS9naWZfMjAwX3MuaWYo/iIqcyCdJMuepI0v62K/giphy.gif');

    const fetchGif = useCallback(async () => {
        const CACHE_KEY = 'motivation_gif_url';
        const DATE_KEY = 'motivation_gif_date';
        const todayStr = new Date().toDateString();

        const cachedUrl = localStorage.getItem(CACHE_KEY);
        const cachedDate = localStorage.getItem(DATE_KEY);

        // If we have a cached GIF from today, use it
        if (cachedUrl && cachedDate === todayStr) {
            setGifUrl(cachedUrl);
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
            const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=motivation&rating=g`);
            const data = await response.json();

            if (data.data?.images?.original?.url) {
                const newUrl = data.data.images.original.url;
                setGifUrl(newUrl);
                localStorage.setItem(CACHE_KEY, newUrl);
                localStorage.setItem(DATE_KEY, todayStr);
            } else if (cachedUrl) {
                // If API fails but we have a cached one (even from a previous day), use it
                setGifUrl(cachedUrl);
            }
        } catch (err) {
            console.error('Giphy API fetch failed', err);
            if (cachedUrl) setGifUrl(cachedUrl);
        }
    }, []);

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

    useEffect(() => {
        fetchData();
        fetchGif();
    }, [fetchData, fetchGif]);

    const currentYear = new Date().getFullYear();

    return (
        <div className="page-home">

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <div className="hero anim-fade-in">
                <div className="hero__grid" style={{ marginBottom: '2rem' }}>
                    <div className="hero__left">
                        <h1 className="hero__title hero__title--custom">
                            HEY KAVI, WELCOME TO RUINS
                        </h1>

                        <p className="hero__sub hero__sub--custom">
                            THE YEAR {year} - VISUAL AUTOGRAPHY OF ME AND MY JOURNEY
                        </p>

                        <div className="quote-box">
                            {gifUrl && <img src={gifUrl} className="quote-box__bg" alt="" />}
                            <div className="quote-box__content">
                                <p className="quote-box__text">"Every moment is a fresh beginning."</p>
                                <span className="quote-box__sub">QUOTE OF THE DAY · VISUAL AUTOGRAPHY</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero__right">
                        <GoalSidebar day={selectedDay} allEvents={events} />
                    </div>
                </div>

                {year === currentYear && <YearProgress year={year} />}
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
                                    <div className="timeline-nav">
                                        <span className="timeline-nav__label">{quad.name.toUpperCase()}</span>
                                        <div className="timeline-nav__line" />
                                    </div>

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
