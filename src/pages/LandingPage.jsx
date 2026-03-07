import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const CALENDAR_DAYS = [
    { day: 1, filled: true, mood: 'great' },
    { day: 2, filled: true, mood: 'good' },
    { day: 3, filled: true, mood: 'great' },
    { day: 4, filled: true, mood: 'okay' },
    { day: 5, filled: true, mood: 'good' },
    { day: 6, filled: true, mood: 'hard' },
    { day: 7, filled: true, mood: 'great' },
    { day: 8, filled: true, mood: 'good' },
    { day: 9, filled: true, mood: 'good' },
    { day: 10, filled: true, mood: 'okay' },
    { day: 11, filled: true, mood: 'great' },
    { day: 12, filled: true, mood: 'hard' },
    { day: 13, filled: true, mood: 'good' },
    { day: 14, filled: true, mood: 'great' },
    { day: 15, filled: true, mood: 'good' },
    { day: 16, filled: true, mood: 'okay' },
    { day: 17, filled: true, mood: 'great' },
    { day: 18, filled: true, mood: 'good' },
    { day: 19, filled: false, mood: null },
    { day: 20, filled: false, mood: null },
    { day: 21, filled: false, mood: null },
    { day: 22, filled: false, mood: null },
    { day: 23, filled: false, mood: null },
    { day: 24, filled: false, mood: null },
    { day: 25, filled: false, mood: null },
    { day: 26, filled: false, mood: null },
    { day: 27, filled: false, mood: null },
    { day: 28, filled: false, mood: null },
    { day: 29, filled: false, mood: null },
    { day: 30, filled: false, mood: null },
    { day: 31, filled: false, mood: null },
    { day: 32, filled: false, mood: null },
    { day: 33, filled: false, mood: null },
    { day: 34, filled: false, mood: null },
    { day: 35, filled: false, mood: null },
];

const FEATURES_DATA = [
    {
        title: 'Daily Goals',
        desc: 'Set intentions every morning. Check them off as you conquer the day. Small wins compound.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        title: 'Day Journal',
        desc: 'Not a diary. A log. Every day gets a mood, a note, a verdict. No fluff, just truth.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h4" />
            </svg>
        ),
    },
    {
        title: 'Visual Timeline',
        desc: 'Your year, rendered as a mosaic. Every square a chapter. Colors tell the story you lived.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
            </svg>
        ),
    },
];

const WHAT_IT_IS = [
    { num: '01', label: 'TRACK', title: 'Track Daily Goals', text: 'Every morning is a contract with yourself. Set your three non-negotiables. Then execute.' },
    { num: '02', label: 'LOG', title: 'Log Your Days', text: 'At 11 PM, the day asks you: what happened? You answer with a mood, a note, and the raw truth.' },
    { num: '03', label: 'OWN', title: 'Own Your Story', text: 'Zoom out. A year of days becomes a mosaic of who you were, who you are, who you\'re becoming.' },
];

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
    }),
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const cardHover = {
    rest: { y: 0, borderColor: 'rgba(255,255,255,0.08)' },
    hover: {
        y: -4,
        borderColor: 'rgba(232,76,30,0.5)',
        boxShadow: '0 0 30px rgba(232,76,30,0.12)',
        transition: { duration: 0.25 },
    },
};

/* ─────────────────────────────────────────────
   SECTION WRAPPER (scroll reveal)
───────────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   MOOD → COLOR MAP
───────────────────────────────────────────── */
function moodColor(mood) {
    switch (mood) {
        case 'great': return '#E84C1E';
        case 'good': return 'rgba(232,76,30,0.65)';
        case 'okay': return 'rgba(232,76,30,0.35)';
        case 'hard': return 'rgba(245,240,232,0.12)';
        default: return 'rgba(255,255,255,0.04)';
    }
}

/* ─────────────────────────────────────────────
   SVG GRAIN FILTER
───────────────────────────────────────────── */
function GrainFilter() {
    return (
        <svg className="fixed inset-0 w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
                <filter id="grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </defs>
        </svg>
    );
}

/* ═════════════════════════════════════════════
   LANDING PAGE
═════════════════════════════════════════════ */
export default function LandingPage() {
    const [email, setEmail] = useState('');

    return (
        <>
            {/* ── FONTS + THEME ───────────────────── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

        :root {
          --color-bg: #0D0D0D;
          --color-surface: #111111;
          --color-cream: #F5F0E8;
          --color-accent: #E84C1E;
          --color-muted: rgba(245,240,232,0.45);
          --color-border: rgba(255,255,255,0.08);
          --font-display: 'Anton', sans-serif;
          --font-body: 'Playfair Display', serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .font-display { font-family: var(--font-display); }
        .font-body { font-family: var(--font-body); }
        
        .grain-overlay {
          position: fixed; inset: 0; z-index: 9999;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        .text-outline {
          -webkit-text-stroke: 1.5px rgba(245,240,232,0.15);
          color: transparent;
        }

        .landing-page a { text-decoration: none; color: inherit; }

        @keyframes float {
          0%, 100% { transform: rotate(-6deg) translateY(0px); }
          50% { transform: rotate(-6deg) translateY(-12px); }
        }

        .calendar-day-cell {
          transition: all 0.2s ease;
        }
        .calendar-day-cell:hover {
          transform: scale(1.25);
          box-shadow: 0 0 16px rgba(232,76,30,0.4);
          z-index: 10;
        }

        ::selection {
          background: rgba(232,76,30,0.35);
          color: #F5F0E8;
        }
      `}</style>

            <div className="grain-overlay" />
            <GrainFilter />

            <div className="landing-page" style={{
                background: 'var(--color-bg)',
                color: 'var(--color-cream)',
                minHeight: '100vh',
                fontFamily: 'var(--font-body)',
                overflowX: 'hidden',
            }}>

                {/* ════════════════════════════════════
            1. NAV
        ════════════════════════════════════ */}
                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        borderBottom: '1px solid var(--color-border)',
                        background: 'rgba(13,13,13,0.85)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                >
                    <div style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span className="font-display" style={{
                            fontSize: '1.25rem',
                            letterSpacing: '0.15em',
                            color: 'var(--color-cream)',
                            textTransform: 'uppercase',
                        }}>
                            CHRON.
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <a
                                href="#features"
                                className="font-body"
                                style={{
                                    fontSize: '0.8125rem',
                                    color: 'var(--color-muted)',
                                    letterSpacing: '0.04em',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => e.target.style.color = 'var(--color-cream)'}
                                onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
                            >
                                Features
                            </a>
                            <a
                                href="#manifesto"
                                className="font-body"
                                style={{
                                    fontSize: '0.8125rem',
                                    color: 'var(--color-muted)',
                                    letterSpacing: '0.04em',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => e.target.style.color = 'var(--color-cream)'}
                                onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
                            >
                                Manifesto
                            </a>
                            <Link
                                to="/login"
                                className="font-display"
                                style={{
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.18em',
                                    color: 'var(--color-cream)',
                                    padding: '0.5rem 1.5rem',
                                    border: '1px solid var(--color-cream)',
                                    transition: 'all 0.2s',
                                    textTransform: 'uppercase',
                                }}
                                onMouseEnter={e => {
                                    e.target.style.background = 'var(--color-cream)';
                                    e.target.style.color = 'var(--color-bg)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--color-cream)';
                                }}
                            >
                                Enter
                            </Link>
                        </div>
                    </div>
                </motion.nav>

                {/* ════════════════════════════════════
            2. HERO
        ════════════════════════════════════ */}
                <section style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    padding: '6rem 2rem 4rem',
                    overflow: 'hidden',
                }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }}>

                        {/* Hero text */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            {['EVERY', 'DAY', 'COUNTS.'].map((word, i) => (
                                <motion.div
                                    key={word}
                                    variants={fadeUp}
                                    custom={i}
                                    className="font-display"
                                    style={{
                                        fontSize: 'clamp(4.5rem, 14vw, 13rem)',
                                        lineHeight: 0.9,
                                        letterSpacing: '-0.02em',
                                        color: i === 2 ? 'var(--color-accent)' : 'var(--color-cream)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {word}
                                </motion.div>
                            ))}

                            <motion.p
                                variants={fadeUp}
                                custom={3}
                                className="font-body"
                                style={{
                                    fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                                    fontStyle: 'italic',
                                    color: 'var(--color-muted)',
                                    marginTop: '2rem',
                                    maxWidth: 420,
                                    lineHeight: 1.7,
                                }}
                            >
                                A personal visual autobiography — your moods, your goals,
                                your days. Every square is a chapter. Every color is an emotion.
                            </motion.p>

                            <motion.div variants={fadeUp} custom={4} style={{ marginTop: '2.5rem' }}>
                                <Link
                                    to="/login"
                                    className="font-display"
                                    style={{
                                        display: 'inline-block',
                                        background: 'var(--color-accent)',
                                        color: '#fff',
                                        padding: '1rem 2.5rem',
                                        fontSize: '0.875rem',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s',
                                    }}
                                    onMouseEnter={e => {
                                        e.target.style.background = '#d4411a';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 32px rgba(232,76,30,0.3)';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'var(--color-accent)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Start Your Story
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Floating mock calendar card */}
                        <motion.div
                            initial={{ opacity: 0, x: 80, rotate: -6 }}
                            animate={{ opacity: 1, x: 0, rotate: -6 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                position: 'absolute',
                                right: '-2%',
                                top: '18%',
                                width: 'clamp(260px, 28vw, 380px)',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                padding: '1.5rem',
                                animation: 'float 5s ease-in-out infinite',
                                boxShadow: '0 20px 60px rgba(232,76,30,0.08), 0 0 80px rgba(232,76,30,0.04)',
                                zIndex: 1,
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                            }}>
                                <span className="font-display" style={{
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.2em',
                                    color: 'var(--color-muted)',
                                    textTransform: 'uppercase',
                                }}>
                                    MARCH 2026
                                </span>
                                <span style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: 'var(--color-accent)',
                                    display: 'inline-block',
                                }} />
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: 4,
                            }}>
                                {CALENDAR_DAYS.slice(0, 28).map((d, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: 3,
                                            background: d.filled ? moodColor(d.mood) : 'rgba(255,255,255,0.03)',
                                            border: d.day === 6 ? '1px solid var(--color-accent)' : '1px solid transparent',
                                            position: 'relative',
                                        }}
                                    >
                                        {d.filled && d.mood === 'great' && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 2,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 3,
                                                height: 3,
                                                borderRadius: '50%',
                                                background: '#fff',
                                                opacity: 0.6,
                                            }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div style={{
                                marginTop: '0.875rem',
                                display: 'flex',
                                gap: '0.75rem',
                                alignItems: 'center',
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }} />
                                <span className="font-body" style={{
                                    fontSize: '0.6875rem',
                                    color: 'var(--color-muted)',
                                    fontStyle: 'italic',
                                }}>
                                    18 days journaled
                                </span>
                            </div>
                        </motion.div>

                        {/* Background oversized text */}
                        <div
                            className="font-display text-outline"
                            aria-hidden="true"
                            style={{
                                position: 'absolute',
                                right: '-5%',
                                bottom: '-15%',
                                fontSize: 'clamp(10rem, 22vw, 22rem)',
                                lineHeight: 1,
                                opacity: 0.04,
                                pointerEvents: 'none',
                                userSelect: 'none',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            2026
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════════
            3. WHAT IT IS — 01 / 02 / 03
        ════════════════════════════════════ */}
                <section style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '6rem 2rem 8rem',
                }}>
                    {WHAT_IT_IS.map((item, idx) => (
                        <Reveal key={item.num} delay={idx * 0.1}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: idx % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
                                gap: '3rem',
                                alignItems: 'center',
                                marginBottom: idx < 2 ? '6rem' : 0,
                                direction: idx % 2 === 0 ? 'ltr' : 'rtl',
                            }}>
                                {/* Number */}
                                <div style={{
                                    direction: 'ltr',
                                    position: 'relative',
                                }}>
                                    <span
                                        className="font-display"
                                        style={{
                                            fontSize: 'clamp(8rem, 16vw, 14rem)',
                                            lineHeight: 0.85,
                                            color: 'transparent',
                                            WebkitTextStroke: '1.5px rgba(232,76,30,0.2)',
                                            display: 'block',
                                        }}
                                    >
                                        {item.num}
                                    </span>
                                </div>
                                {/* Content */}
                                <div style={{ direction: 'ltr' }}>
                                    <span
                                        className="font-display"
                                        style={{
                                            display: 'inline-block',
                                            fontSize: '0.625rem',
                                            letterSpacing: '0.3em',
                                            color: 'var(--color-accent)',
                                            border: '1px solid rgba(232,76,30,0.3)',
                                            padding: '0.25rem 0.75rem',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                    <h3 className="font-display" style={{
                                        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                        letterSpacing: '0.04em',
                                        marginBottom: '0.75rem',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-cream)',
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p className="font-body" style={{
                                        fontSize: '1rem',
                                        lineHeight: 1.8,
                                        color: 'var(--color-muted)',
                                        maxWidth: 440,
                                    }}>
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </section>

                {/* ════════════════════════════════════
            4. FEATURES — 3 Cards
        ════════════════════════════════════ */}
                <section
                    id="features"
                    style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        padding: '4rem 2rem 8rem',
                    }}
                >
                    <Reveal>
                        <div style={{ marginBottom: '4rem' }}>
                            <span
                                className="font-display"
                                style={{
                                    fontSize: '0.625rem',
                                    letterSpacing: '0.4em',
                                    color: 'var(--color-accent)',
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                FEATURES
                            </span>
                            <h2 className="font-display" style={{
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                letterSpacing: '0.02em',
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                color: 'var(--color-cream)',
                            }}>
                                THE TOOLKIT
                            </h2>
                        </div>
                    </Reveal>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        {FEATURES_DATA.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.1}>
                                <motion.div
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                    style={{
                                        background: 'rgba(255,255,255,0.025)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        backdropFilter: 'blur(8px)',
                                        WebkitBackdropFilter: 'blur(8px)',
                                        padding: '2rem',
                                        cursor: 'default',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Top accent line */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: 'linear-gradient(90deg, var(--color-accent) 0%, transparent 60%)',
                                        opacity: 0.4,
                                    }} />

                                    <div style={{
                                        color: 'var(--color-accent)',
                                        marginBottom: '1.25rem',
                                    }}>
                                        {f.icon}
                                    </div>
                                    <h3 className="font-display" style={{
                                        fontSize: '1.125rem',
                                        letterSpacing: '0.12em',
                                        marginBottom: '0.75rem',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-cream)',
                                    }}>
                                        {f.title}
                                    </h3>
                                    <p className="font-body" style={{
                                        fontSize: '0.9375rem',
                                        lineHeight: 1.7,
                                        color: 'var(--color-muted)',
                                    }}>
                                        {f.desc}
                                    </p>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ════════════════════════════════════
            5. CALENDAR PREVIEW
        ════════════════════════════════════ */}
                <section style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '4rem 2rem 8rem',
                    position: 'relative',
                }}>
                    {/* Rotated section label */}
                    <Reveal>
                        <div style={{
                            position: 'absolute',
                            left: -20,
                            top: '50%',
                            transform: 'rotate(-90deg) translateX(-50%)',
                            transformOrigin: 'left center',
                        }}>
                            <span className="font-display" style={{
                                fontSize: '0.6875rem',
                                letterSpacing: '0.5em',
                                color: 'rgba(245,240,232,0.15)',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                            }}>
                                YOUR YEAR
                            </span>
                        </div>
                    </Reveal>

                    <Reveal>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '3rem',
                            flexWrap: 'wrap',
                        }}>
                            {/* Left info */}
                            <div style={{ flex: '1 1 260px', minWidth: 260 }}>
                                <span
                                    className="font-display"
                                    style={{
                                        fontSize: '0.625rem',
                                        letterSpacing: '0.4em',
                                        color: 'var(--color-accent)',
                                        display: 'block',
                                        marginBottom: '0.75rem',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    TIMELINE
                                </span>
                                <h2 className="font-display" style={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    letterSpacing: '0.02em',
                                    lineHeight: 1,
                                    textTransform: 'uppercase',
                                    color: 'var(--color-cream)',
                                    marginBottom: '1rem',
                                }}>
                                    EVERY SQUARE<br />IS A CHAPTER
                                </h2>
                                <p className="font-body" style={{
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.8,
                                    color: 'var(--color-muted)',
                                    maxWidth: 340,
                                }}>
                                    Great days glow orange. Hard days stay muted.
                                    The grid doesn't judge — it just remembers.
                                </p>

                                {/* Legend */}
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginTop: '1.5rem',
                                    flexWrap: 'wrap',
                                }}>
                                    {[
                                        { label: 'Great', color: '#E84C1E' },
                                        { label: 'Good', color: 'rgba(232,76,30,0.65)' },
                                        { label: 'Okay', color: 'rgba(232,76,30,0.35)' },
                                        { label: 'Hard', color: 'rgba(245,240,232,0.12)' },
                                    ].map(l => (
                                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <div style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 2,
                                                background: l.color,
                                            }} />
                                            <span className="font-body" style={{
                                                fontSize: '0.6875rem',
                                                color: 'var(--color-muted)',
                                            }}>
                                                {l.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar grid */}
                            <div style={{
                                flex: '1 1 360px',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                padding: '2rem',
                            }}>
                                {/* Weekday headers */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: 6,
                                    marginBottom: 8,
                                }}>
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                        <div key={i} className="font-display" style={{
                                            textAlign: 'center',
                                            fontSize: '0.5625rem',
                                            letterSpacing: '0.15em',
                                            color: 'rgba(245,240,232,0.2)',
                                        }}>
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: 6,
                                }}>
                                    {CALENDAR_DAYS.map((d, i) => (
                                        <div
                                            key={i}
                                            className="calendar-day-cell"
                                            style={{
                                                aspectRatio: '1',
                                                borderRadius: 3,
                                                background: d.filled ? moodColor(d.mood) : 'rgba(255,255,255,0.025)',
                                                cursor: 'pointer',
                                                position: 'relative',
                                            }}
                                        >
                                            {/* Streak dot */}
                                            {d.filled && i > 0 && CALENDAR_DAYS[i - 1]?.filled && d.mood === 'great' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 2,
                                                    right: 2,
                                                    width: 3,
                                                    height: 3,
                                                    borderRadius: '50%',
                                                    background: '#fff',
                                                    opacity: 0.5,
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    marginTop: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <span className="font-body" style={{
                                        fontSize: '0.6875rem',
                                        fontStyle: 'italic',
                                        color: 'var(--color-muted)',
                                    }}>
                                        March 2026
                                    </span>
                                    <span className="font-display" style={{
                                        fontSize: '0.5625rem',
                                        letterSpacing: '0.2em',
                                        color: 'var(--color-accent)',
                                    }}>
                                        18/31 FILLED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ════════════════════════════════════
            6. MANIFESTO QUOTE
        ════════════════════════════════════ */}
                <section
                    id="manifesto"
                    style={{
                        background: '#0a0a0a',
                        padding: 'clamp(4rem, 10vw, 8rem) 2rem',
                        textAlign: 'center',
                        position: 'relative',
                    }}
                >
                    <Reveal>
                        <div style={{ maxWidth: 900, margin: '0 auto' }}>
                            {/* Top rule */}
                            <div style={{
                                width: 60,
                                height: 1,
                                background: 'var(--color-accent)',
                                margin: '0 auto 3rem',
                            }} />

                            <blockquote className="font-body" style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
                                fontStyle: 'italic',
                                fontWeight: 400,
                                lineHeight: 1.4,
                                color: 'var(--color-cream)',
                                letterSpacing: '0.01em',
                            }}>
                                "The days you don't count are the days that count the most."
                            </blockquote>

                            {/* Bottom rule */}
                            <div style={{
                                width: 60,
                                height: 1,
                                background: 'var(--color-accent)',
                                margin: '3rem auto 0',
                            }} />
                        </div>
                    </Reveal>
                </section>

                {/* ════════════════════════════════════
            7. CTA FOOTER SECTION
        ════════════════════════════════════ */}
                <section style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '8rem 2rem 3rem',
                    textAlign: 'center',
                }}>
                    <Reveal>
                        <h2 className="font-display" style={{
                            fontSize: 'clamp(3rem, 10vw, 8rem)',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            color: 'var(--color-cream)',
                            textTransform: 'uppercase',
                            marginBottom: '2.5rem',
                        }}>
                            BEGIN<br />TODAY.
                        </h2>

                        <div style={{
                            display: 'flex',
                            gap: 0,
                            maxWidth: 480,
                            margin: '0 auto',
                            justifyContent: 'center',
                        }}>
                            <Link
                                to="/login"
                                className="font-display"
                                style={{
                                    display: 'inline-block',
                                    background: 'var(--color-accent)',
                                    color: '#fff',
                                    padding: '1rem 3rem',
                                    fontSize: '0.875rem',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => {
                                    e.target.style.background = '#d4411a';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 32px rgba(232,76,30,0.3)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = 'var(--color-accent)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Start Your Story →
                            </Link>
                        </div>
                    </Reveal>
                </section>

                {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
                <footer style={{
                    borderTop: '1px solid var(--color-border)',
                    padding: '2rem',
                    maxWidth: 1280,
                    margin: '0 auto',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap',
                        }}>
                            <span className="font-body" style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-muted)',
                            }}>
                                © {new Date().getFullYear()} King Diaries
                            </span>
                            <span style={{ color: 'rgba(245,240,232,0.15)' }}>·</span>
                            <span className="font-body" style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-muted)',
                            }}>
                                Built by{' '}
                                <a
                                    href="https://x.com/goelsahhab"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-cream)', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--color-accent)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--color-cream)'}
                                >
                                    @goelsahhab
                                </a>
                                {' '}and{' '}
                                <a
                                    href="https://x.com/ishankumax"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-cream)', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--color-accent)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--color-cream)'}
                                >
                                    @ishankumax
                                </a>
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap',
                        }}>
                            <span className="font-body" style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-muted)',
                            }}>
                                Based on{' '}
                                <a
                                    href="https://archivist.ramx.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-cream)', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--color-accent)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--color-cream)'}
                                >
                                    Archivist
                                </a>
                                {' '}by{' '}
                                <a
                                    href="https://x.com/ramxcodes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-cream)', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--color-accent)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--color-cream)'}
                                >
                                    @ramxcodes
                                </a>
                            </span>
                            <a
                                href="https://github.com/coderkavyag"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'var(--color-muted)',
                                    display: 'inline-flex',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-cream)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
