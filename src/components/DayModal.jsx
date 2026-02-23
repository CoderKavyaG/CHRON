import { useState, useEffect } from 'react';
import { X, Trash2, Save, CalendarDays } from 'lucide-react';
import { LEGEND_CONFIG, DEFAULT_CATEGORIES } from '../lib/constants';
import { formatDisplayDate, isFuture, isToday } from '../lib/dateUtils';
import * as api from '../lib/api';
import GoalsSection from './GoalsSection';
import EventsSection from './EventsSection';
import toast from 'react-hot-toast';


export default function DayModal({ day, entry, onClose, onSave }) {
    const [mood, setMood] = useState(entry?.legend || null);
    const [reviewInputs, setReviews] = useState({});
    const [cats, setCats] = useState([]);
    const [showNotes, setShowNotes] = useState(false);
    const [saving, setSaving] = useState(false);
    const future = isFuture(day.dateKey);
    const todayDay = isToday(day.dateKey);

    useEffect(() => {
        Promise.all([
            future ? Promise.resolve([]) : api.getReviewsDay(day.dateKey),
            api.getCategories(),
            future ? Promise.resolve([]) : api.getGoalsDay(day.dateKey),
        ]).then(([reviews, customCats, goals]) => {
            const map = {};
            (reviews || []).forEach(r => { map[r.category] = r.content; });

            // Auto-fill wins from completed goals (only if not already written)
            if (!map['wins']) {
                const done = (goals || []).filter(g => g.completed).map(g => `✓ ${g.title}`);
                if (done.length > 0) map['wins'] = done.join('\n');
            }

            setReviews(map);
            setCats(customCats || []);
            // Auto-open notes if there's content OR completed goals
            if ((reviews || []).length > 0 || (goals || []).some(g => g.completed)) {
                setShowNotes(true);
            }
        });
    }, [day.dateKey, future]);

    // ESC / backdrop close
    const handleBackdrop = e => { if (e.target === e.currentTarget) onClose(); };
    useEffect(() => {
        const fn = e => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', fn);
        return () => document.removeEventListener('keydown', fn);
    }, [onClose]);

    const handleSave = async () => {
        if (!mood) { toast.error('Pick a mood first'); return; }
        setSaving(true);
        try {
            await api.saveDay(day.dateKey, mood);
            // Save standard categories + wins + any custom categories
            const allCats = [
                ...DEFAULT_CATEGORIES,
                { value: 'wins', label: 'Wins', emoji: '🏆' },
                ...cats.map(c => ({ value: c.id })),
            ];
            await Promise.all(
                allCats
                    .filter(cat => reviewInputs[cat.value]?.trim())
                    .map(cat => api.saveReview(day.dateKey, cat.value, reviewInputs[cat.value].trim()))
            );
            toast.success('Saved! ✨');
            await onSave();
            onClose();
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.deleteDay(day.dateKey);
            toast.success('Entry deleted 🗑️');
            await onSave();
            onClose();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const allCats = [
        ...DEFAULT_CATEGORIES,
        ...cats.map(c => ({ value: c.id, label: c.name, emoji: '📌' })),
    ];

    return (
        <div className="modal-overlay" onClick={handleBackdrop}>
            <div className="modal-box anim-scale-in" style={{ maxHeight: '88vh', overflowY: 'auto' }}>

                {/* Header */}
                <div className="modal-header">
                    <div>
                        <div className="modal-title">
                            {future ? '📅 Plan this day' : todayDay ? '✏️ Today' : '📖 Journal entry'}
                        </div>
                        <div className="modal-date">{formatDisplayDate(day.dateKey)}</div>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={16} /></button>
                </div>

                {/* ── FUTURE DATE: Events + Goals ───────────────────────────────────── */}
                {future ? (
                    <>
                        <div className="future-day-modal">
                            <div className="future-day-modal__tag">
                                <CalendarDays size={11} /> Future day — plan ahead
                            </div>
                        </div>
                        <div className="modal-section-label">Events & Plans</div>
                        <EventsSection dateKey={day.dateKey} />
                        <div className="modal-section-label">Goals & Tasks</div>
                        <GoalsSection dateKey={day.dateKey} readOnly={false} />
                        <div style={{ padding: '0.75rem 1.25rem 1.25rem' }}>
                            <button className="btn-cancel" style={{ width: '100%' }} onClick={onClose}>
                                Done
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* ── MOOD SECTION ─────────────────────────────────────────────── */}
                        <div className="modal-section-label">How was your day?</div>
                        <div className="mood-pills" style={{ paddingTop: 0 }}>
                            {Object.entries(LEGEND_CONFIG).map(([type, cfg]) => (
                                <button
                                    key={type}
                                    className={`mood-pill ${mood === type ? 'mood-pill--active' : ''}`}
                                    style={mood === type ? {
                                        borderColor: cfg.color + '55',
                                        background: cfg.color + '18',
                                        color: cfg.color,
                                    } : {}}
                                    onClick={() => setMood(type)}
                                >
                                    <span className="mood-pill__dot" style={{ background: cfg.color }} />
                                    {cfg.label}
                                </button>
                            ))}
                        </div>

                        {/* ── GOALS SECTION ─────────────────────────────────────────────── */}
                        <div className="modal-section-label">Goals & Tasks</div>
                        <GoalsSection dateKey={day.dateKey} readOnly={false} />

                        {/* ── NOTES SECTION ─────────────────────────────────────────────── */}
                        <div className="modal-section-label" style={{ cursor: 'pointer' }}
                            onClick={() => setShowNotes(s => !s)}>
                            Notes {showNotes ? '▾' : '▸'}
                        </div>
                        {showNotes && (
                            <div className="modal-reviews" style={{ paddingBottom: '0.5rem' }}>
                                {/* Wins field — pre-fills from completed goals */}
                                <div className="review-field">
                                    <label className="review-label">
                                        🏆 Wins today
                                        <span style={{ fontWeight: 400, color: 'var(--text-3)', marginLeft: '0.375rem', textTransform: 'none', fontSize: '0.625rem' }}>
                                            auto-filled from completed goals
                                        </span>
                                    </label>
                                    <textarea
                                        className="review-textarea"
                                        placeholder="What did you accomplish?"
                                        rows={2}
                                        value={reviewInputs['wins'] || ''}
                                        onChange={e => setReviews(p => ({ ...p, wins: e.target.value }))}
                                    />
                                </div>
                                <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                    {allCats.map(cat => (
                                        <div key={cat.value} className="review-field">
                                            <label className="review-label">{cat.emoji} {cat.label}</label>
                                            <textarea
                                                className="review-textarea"
                                                placeholder="What happened?"
                                                rows={2}
                                                value={reviewInputs[cat.value] || ''}
                                                onChange={e =>
                                                    setReviews(p => ({ ...p, [cat.value]: e.target.value }))
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── ACTIONS ───────────────────────────────────────────────────── */}
                        <div className="modal-actions">
                            <button className="btn-save" onClick={handleSave} disabled={saving}>
                                <Save size={14} /> {saving ? 'Saving…' : 'Save Day'}
                            </button>
                            {entry && (
                                <button className="btn-delete" onClick={handleDelete} title="Delete entry">
                                    <Trash2 size={14} />
                                </button>
                            )}
                            <button className="btn-cancel" onClick={onClose}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
