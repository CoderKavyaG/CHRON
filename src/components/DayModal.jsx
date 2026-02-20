import { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { LEGEND_CONFIG, DEFAULT_CATEGORIES } from '../lib/constants';
import { formatDisplayDate, isFuture } from '../lib/dateUtils';
import * as api from '../lib/api';
import toast from 'react-hot-toast';

export default function DayModal({ day, entry, onClose, onSave }) {
    const [mood, setMood] = useState(entry?.legend || null);
    const [reviewInputs, setReviews] = useState({});
    const [cats, setCats] = useState([]);
    const [showNotes, setShowNotes] = useState(false);
    const [saving, setSaving] = useState(false);
    const future = isFuture(day.dateKey);

    useEffect(() => {
        // Load existing reviews + custom categories in parallel
        Promise.all([
            api.getReviewsDay(day.dateKey),
            api.getCategories(),
        ]).then(([reviews, customCats]) => {
            const map = {};
            (reviews || []).forEach(r => { map[r.category] = r.content; });
            setReviews(map);
            setCats(customCats || []);
            if ((reviews || []).length > 0) setShowNotes(true);
        });
    }, [day.dateKey]);

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
            // Save all non-empty reviews
            const allCats = [
                ...DEFAULT_CATEGORIES,
                ...cats.map(c => ({ value: c.id, label: c.name })),
            ];
            await Promise.all(
                allCats.map(cat => {
                    const text = reviewInputs[cat.value]?.trim();
                    if (text) return api.saveReview(day.dateKey, cat.value, text);
                    return null;
                }).filter(Boolean)
            );
            toast.success('Saved! ✨');
            await onSave();
            onClose();
        } catch (err) {
            toast.error('Failed to save');
            console.error(err);
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
            <div className="modal-box anim-scale-in">

                {/* Header */}
                <div className="modal-header">
                    <div>
                        <div className="modal-title">How was your day?</div>
                        <div className="modal-date">{formatDisplayDate(day.dateKey)}</div>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={16} /></button>
                </div>

                {future ? (
                    <div style={{ padding: '1.5rem 1.25rem', color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center' }}>
                        Cannot create entries for future dates.
                    </div>
                ) : (
                    <>
                        {/* Mood pills */}
                        <div className="mood-pills">
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

                        {/* Notes */}
                        <div className="modal-divider" />
                        <div className="modal-reviews">
                            {!showNotes ? (
                                <button className="modal-reviews__toggle" onClick={() => setShowNotes(true)}>
                                    + Add notes (optional)
                                </button>
                            ) : (
                                <div style={{ maxHeight: '200px', overflowY: 'auto', paddingBottom: '0.5rem' }}>
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
                            )}
                        </div>

                        {/* Actions */}
                        <div className="modal-actions">
                            <button className="btn-save" onClick={handleSave} disabled={saving}>
                                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
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
