import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { Legend, LEGEND_CONFIG, DEFAULT_CATEGORIES } from '../lib/constants';
import { formatDisplayDate, isFuture } from '../lib/dateUtils';
import {
    saveEntry,
    deleteEntry,
    getReviewsForDay,
    saveReview,
    getCustomCategories,
} from '../lib/storage';
import toast from 'react-hot-toast';

export default function DayModal({ day, entry, onClose, onSave }) {
    const [selectedLegend, setSelectedLegend] = useState(entry?.legend || null);
    const [reviewInputs, setReviewInputs] = useState({});
    const [showReviews, setShowReviews] = useState(false);
    const modalRef = useRef(null);

    const future = isFuture(day.dateKey);

    useEffect(() => {
        const reviews = getReviewsForDay(day.dateKey);
        const inputs = {};
        reviews.forEach((r) => {
            inputs[r.category] = r.content;
        });
        setReviewInputs(inputs);
        // Auto-show reviews if there are existing ones
        if (reviews.length > 0) setShowReviews(true);
    }, [day.dateKey]);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSave = () => {
        if (!selectedLegend) {
            toast.error('Pick a mood first');
            return;
        }
        saveEntry(day.dateKey, selectedLegend);
        Object.entries(reviewInputs).forEach(([category, content]) => {
            if (content?.trim()) saveReview(day.dateKey, category, content.trim());
        });
        toast.success('Saved!', { icon: '✨' });
        onSave();
        onClose();
    };

    const handleDelete = () => {
        deleteEntry(day.dateKey);
        toast.success('Deleted', { icon: '🗑️' });
        onSave();
        onClose();
    };

    const allCategories = [
        ...DEFAULT_CATEGORIES,
        ...getCustomCategories().map((c) => ({ value: c.id, label: c.name, emoji: '📌' })),
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-md glass-card rounded-2xl overflow-hidden animate-fade-in-scale"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-3">
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            How was your day?
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                            {formatDisplayDate(day.dateKey)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-surface-overlay transition-colors text-text-muted"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {future ? (
                    <div className="px-5 pb-5 text-center">
                        <p className="text-text-muted text-sm py-6">
                            Cannot create entries for future dates
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mood pills — compact horizontal layout */}
                        <div className="px-5 pb-4">
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(LEGEND_CONFIG).map(([type, config]) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedLegend(type)}
                                        className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      border transition-all duration-150
                      ${selectedLegend === type
                                                ? 'border-transparent scale-105 shadow-md'
                                                : 'border-border hover:border-border-hover bg-surface'
                                            }
                    `}
                                        style={
                                            selectedLegend === type
                                                ? { backgroundColor: config.color + '25', color: config.color, borderColor: config.color + '50' }
                                                : { color: '#9CA3AF' }
                                        }
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: config.color }}
                                        />
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle reviews */}
                        {!showReviews && (
                            <div className="px-5 pb-3">
                                <button
                                    onClick={() => setShowReviews(true)}
                                    className="text-xs text-accent hover:text-accent-hover transition-colors"
                                >
                                    + Add notes (optional)
                                </button>
                            </div>
                        )}

                        {/* Reviews — collapsible, cleaner */}
                        {showReviews && (
                            <div className="px-5 pb-4 space-y-2.5 max-h-48 overflow-y-auto">
                                {allCategories.map((cat) => (
                                    <div key={cat.value}>
                                        <label className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                                            {cat.emoji} {cat.label}
                                        </label>
                                        <textarea
                                            className="input-field text-sm mt-1"
                                            placeholder={`What happened?`}
                                            value={reviewInputs[cat.value] || ''}
                                            onChange={(e) =>
                                                setReviewInputs((p) => ({ ...p, [cat.value]: e.target.value }))
                                            }
                                            rows={2}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 p-5 pt-3 border-t border-border">
                            <button
                                onClick={handleSave}
                                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5"
                            >
                                <Save className="w-3.5 h-3.5" />
                                Save
                            </button>
                            {entry && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
