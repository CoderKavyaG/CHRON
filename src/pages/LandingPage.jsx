import { Link } from 'react-router-dom';
import { Crown, BookOpen, CalendarDays, Target, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="page-landing">
            {/* ── NAV ─────────────────────────────────────────── */}
            <nav className="landing-nav">
                <div className="landing-nav__inner">
                    <div className="landing-nav__logo">
                        <Crown size={20} strokeWidth={2.5} />
                        <span>KING DIARIES</span>
                    </div>
                    <div className="landing-nav__actions">
                        <Link to="/login" className="landing-nav__link">Log in</Link>
                        <Link to="/login" className="landing-nav__cta">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ────────────────────────────────────────── */}
            <section className="landing-hero">
                <div className="landing-hero__badge">✨ Your personal visual diary</div>
                <h1 className="landing-hero__title">
                    Your Year,<br />
                    <span className="landing-hero__title--accent">One Square at a Time</span>
                </h1>
                <p className="landing-hero__sub">
                    Track your moods, set daily goals, plan events, and reflect on your journey — all in a beautiful, visual calendar.
                </p>
                <div className="landing-hero__cta-row">
                    <Link to="/login" className="landing-hero__btn-primary">
                        Get Started Free <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ── PREVIEW ─────────────────────────────────────── */}
            <section className="landing-preview">
                <div className="landing-preview__window">
                    <div className="landing-preview__bar">
                        <div className="landing-preview__dots">
                            <span /><span /><span />
                        </div>
                    </div>
                    <div className="landing-preview__grid">
                        {/* Miniature calendar preview */}
                        <div className="landing-preview__cal">
                            <div className="landing-preview__month-label">MARCH 2026</div>
                            <div className="landing-preview__tiles">
                                {Array.from({ length: 31 }, (_, i) => {
                                    const moods = ['#22D3EE', '#22C55E', '#FACC15', '#FB923C', '#EF4444', '#2A2B2F'];
                                    const color = i < 6 ? moods[i % 5] : moods[5];
                                    return (
                                        <div
                                            key={i}
                                            className="landing-preview__tile"
                                            style={{ background: color, animationDelay: `${i * 30}ms` }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        {/* Goals preview */}
                        <div className="landing-preview__sidebar">
                            <div className="landing-preview__sidebar-title">GOALS FOR TODAY</div>
                            <div className="landing-preview__goal">
                                <span className="landing-preview__check landing-preview__check--done">✓</span>
                                <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>Morning workout</span>
                            </div>
                            <div className="landing-preview__goal">
                                <span className="landing-preview__check landing-preview__check--done">✓</span>
                                <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>Read 20 pages</span>
                            </div>
                            <div className="landing-preview__goal">
                                <span className="landing-preview__check" />
                                <span>Write journal entry</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ────────────────────────────────────── */}
            <section className="landing-features">
                <div className="landing-features__grid">
                    <div className="landing-feature-card">
                        <div className="landing-feature-card__icon" style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE' }}>
                            <CalendarDays size={22} />
                        </div>
                        <h3>Mood Calendar</h3>
                        <p>Color-code every day by your mood. See your year unfold as a vibrant mosaic of emotions.</p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-card__icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                            <Target size={22} />
                        </div>
                        <h3>Daily Goals</h3>
                        <p>Set, track, and complete goals each day. Build habits and watch your progress grow.</p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-card__icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                            <BookOpen size={22} />
                        </div>
                        <h3>Journal & Reflect</h3>
                        <p>Write daily notes across categories. Reflect on your work, personal life, and growth.</p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-card__icon" style={{ background: 'rgba(250,204,21,0.1)', color: '#FACC15' }}>
                            <Sparkles size={22} />
                        </div>
                        <h3>Events & Plans</h3>
                        <p>Plan ahead with events on any date. Never miss an important moment in your life.</p>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────── */}
            <footer className="landing-footer">
                <div className="landing-footer__inner">
                    <div className="landing-footer__left">
                        <span>King Diaries &copy; {new Date().getFullYear()}</span>
                        <span className="landing-footer__sep">·</span>
                        <span>
                            Built by{' '}
                            <a href="https://x.com/goelsahhab" target="_blank" rel="noopener noreferrer" className="landing-footer__link">
                                @goelsahhab
                            </a>
                        </span>
                    </div>
                    <div className="landing-footer__right">
                        <span>
                            Based on{' '}
                            <a href="https://archivist.ramx.in/" target="_blank" rel="noopener noreferrer" className="landing-footer__link">
                                Archivist
                            </a>
                            {' '}by{' '}
                            <a href="https://x.com/ramxcodes" target="_blank" rel="noopener noreferrer" className="landing-footer__link">
                                @ramxcodes
                            </a>
                        </span>
                        <span className="landing-footer__sep">·</span>
                        <a
                            href="https://github.com/coderkavyag"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="landing-footer__link landing-footer__github"
                            title="GitHub"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
