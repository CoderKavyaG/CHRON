import { useState, useCallback, useEffect } from 'react';
import { QUADRIMESTERS } from '../lib/constants';
import * as api from '../lib/api';
import toast from 'react-hot-toast';
import MonthGrid from '../components/MonthGrid';
import DayModal from '../components/DayModal';
import GoalSidebar from '../components/GoalSidebar';
import { useAuth } from '../contexts/AuthContext';
import { MOTIVATIONAL_QUOTES } from '../lib/quotes';

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
    const todayKey = new Date().toLocaleDateString('sv-SE');
    const [selectedDay, setDay] = useState({
        dateKey: todayKey,
        isValid: true
    });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gifUrl, setGifUrl] = useState('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGI2YjY4YjY4YjY4YjY4YjY4YjY4YjY4YjY4YjY4YjYvZW5waGlidS9naWZfMjAwX3MuaWYo/iIqcyCdJMuepI0v62K/giphy.gif');
    const [quote, setQuote] = useState(() => {
        const cached = localStorage.getItem('motivation_quote');
        const date = localStorage.getItem('motivation_quote_date');
        const todayStr = new Date().toDateString();
        if (cached && date === todayStr) return JSON.parse(cached);
        return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    });
    const [reshuffles, setReshuffles] = useState(() => {
        const count = localStorage.getItem('motivation_reshuffle_count');
        const date = localStorage.getItem('motivation_reshuffle_date');
        const todayStr = new Date().toDateString();
        if (date === todayStr) {
            return parseInt(count || '0', 10);
        }
        return 0;
    });

    const handleReshuffle = async () => {
        if (reshuffles >= 3) return;

        const loadingToast = toast.loading('Aligning the stars...');

        try {
            const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
            const queries = [
                'interstellar cinemagraph aesthetic',
                'blade runner 2049 cinematic loop',
                'batman dark atmosphere cinemagraph',
                'movie scene powerful cinemagraph',
                'landscape cinematic loop atmosphere',
                'minimalist architecture cinematic dark',
                'architectural loop cinemagraph'
            ];
            const q = queries[Math.floor(Math.random() * queries.length)];
            const offset = Math.floor(Math.random() * 50);

            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=1&offset=${offset}&rating=pg-13`);

            if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            }

            const data = await response.json();

            if (data.data?.[0]?.images?.original?.url) {
                const newUrl = data.data[0].images.original.url;
                const newCount = reshuffles + 1;
                const todayStr = new Date().toDateString();

                // Shuffle quote too
                const newQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

                setGifUrl(newUrl);
                setReshuffles(newCount);
                setQuote(newQuote);

                localStorage.setItem('motivation_gif_url', newUrl);
                localStorage.setItem('motivation_gif_date', todayStr);
                localStorage.setItem('motivation_reshuffle_count', newCount.toString());
                localStorage.setItem('motivation_reshuffle_date', todayStr);
                localStorage.setItem('motivation_quote', JSON.stringify(newQuote));
                localStorage.setItem('motivation_quote_date', todayStr);

                toast.success(`${3 - newCount} reshuffles remaining. Stay focused.`, { id: loadingToast });
            } else {
                toast.error('Giphy is taking a breather. Try again shortly.', { id: loadingToast });
            }
        } catch (err) {
            console.error('Reshuffle failed', err);
            const msg = err.message === 'RATE_LIMIT'
                ? 'Rate limit hit. The universe says wait a moment.'
                : 'Failed to find a new vibe.';
            toast.error(msg, { id: loadingToast });
        }
    };

    const fetchGif = useCallback(async () => {
        const CACHE_KEY = 'motivation_gif_url';
        const DATE_KEY = 'motivation_gif_date';
        const todayStr = new Date().toDateString();
        const cachedUrl = localStorage.getItem(CACHE_KEY);
        const cachedDate = localStorage.getItem(DATE_KEY);

        if (cachedUrl && cachedDate === todayStr) {
            setGifUrl(cachedUrl);
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
            const queries = [
                'interstellar cinematic aesthetic',
                'batman dark atmosphere cinemagraph',
                'blade runner loop',
                'minimalist architecture cinematic',
                'landscape atmosphere cinemagraph'
            ];
            const q = queries[Math.floor(Math.random() * queries.length)];
            const offset = Math.floor(Math.random() * 40);
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=1&offset=${offset}&rating=pg-13`);
            const data = await response.json();

            if (data.data?.[0]?.images?.original?.url) {
                const newUrl = data.data[0].images.original.url;
                setGifUrl(newUrl);
                localStorage.setItem(CACHE_KEY, newUrl);
                localStorage.setItem(DATE_KEY, todayStr);

                // Also save current quote if not cached for today
                if (!localStorage.getItem('motivation_quote_date')) {
                    localStorage.setItem('motivation_quote', JSON.stringify(quote));
                    localStorage.setItem('motivation_quote_date', todayStr);
                }
            } else if (cachedUrl) {
                setGifUrl(cachedUrl);
            }
        } catch (err) {
            console.error('Giphy API fetch failed', err);
            if (cachedUrl) setGifUrl(cachedUrl);
        }
    }, [quote]);

    const { user, loading: authLoading } = useAuth();
    const userName = (user?.displayName || 'Adventurer').toUpperCase();
    const currentYear = new Date().getFullYear();

    const fetchData = useCallback(async () => {
        if (!user) return; // Wait for user to be available
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
    }, [user]);

    // Check journaling time and auto-open modal
    useEffect(() => {
        if (!user || loading) return;

        const checkAndOpenModal = async () => {
            try {
                const settings = await api.getSettings();
                const journalingTime = settings?.journalingTime || '21:00';
                const [hours] = journalingTime.split(':').map(Number);

                const now = new Date();
                const currentHours = now.getHours();

                // Auto-open if current time is within the journaling hour
                if (currentHours === hours && !showModal) {
                    const lastAutoOpenKey = `lastAutoOpen-${todayKey}`;
                    const lastAutoOpen = localStorage.getItem(lastAutoOpenKey);

                    // Only auto-open once per day
                    if (!lastAutoOpen) {
                        setDay({ dateKey: todayKey, isValid: true });
                        setShowModal(true);
                        localStorage.setItem(lastAutoOpenKey, new Date().toISOString());
                    }
                }
            } catch (err) {
                console.error('Failed to check journaling time', err);
            }
        };

        checkAndOpenModal();
    }, [user, loading, todayKey, showModal]);

    useEffect(() => {
        if (user) {
            fetchData();
            fetchGif();
        }
    }, [user, fetchData, fetchGif]);

    return (
        <div className="page-home">
            <div className="hero anim-fade-in">
                <div className="hero__grid" style={{ marginBottom: '2rem' }}>
                    <div className="hero__left">
                        <h1 className="hero__title hero__title--custom">
                            {userName}'S CHRONICLE
                        </h1>

                        <p className="hero__sub hero__sub--custom">
                            The year {year} — a visual autobiography of your journey, one day at a time.
                        </p>

                        <div className="quote-box">
                            {gifUrl && <img src={gifUrl} className="quote-box__bg" alt="Daily inspiration" />}

                            {reshuffles < 3 && user && (
                                <button
                                    className="reshuffle-btn"
                                    onClick={handleReshuffle}
                                    title={`Reshuffle GIF (${3 - reshuffles} left)`}
                                >
                                    RE ({3 - reshuffles})
                                </button>
                            )}

                            <div className="quote-box__content">
                                <div className="quote-box__text">"{quote.text}"</div>
                                <div className="quote-box__sub">— {quote.author}</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero__right">
                        <GoalSidebar day={selectedDay} allEvents={events} />
                    </div>
                </div>

                {year === currentYear && <YearProgress year={year} />}
            </div>

            {loading ? (
                <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.9rem' }}>
                    Loading your journal…
                </div>
            ) : (
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
                                                const todayKeyStr = new Date().toLocaleDateString('sv-SE');
                                                if (day.dateKey === todayKeyStr) {
                                                    const hours = new Date().getHours();
                                                    if (hours >= 23) {
                                                        setShowModal(true);
                                                    } else {
                                                        toast('Journaling opens at 11:00 PM', { icon: '🌙' });
                                                        setShowModal(false);
                                                    }
                                                } else {
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
            )}

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
