import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Check, Trash2, Edit3 } from 'lucide-react';
import * as api from '../lib/api';
import toast from 'react-hot-toast';

export default function GoalSidebar({ day, allEvents = {} }) {
    const [goals, setGoals] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [editingNote, setEditingNote] = useState(null); // id of goal being edited
    const [noteText, setNoteText] = useState('');
    const [loading, setLoading] = useState(true);

    const dateKey = day?.dateKey;

    const fetchGoals = useCallback(async () => {
        if (!dateKey) return;
        setLoading(true);
        try {
            const data = await api.getGoalsDay(dateKey);
            setGoals(data || []);
        } finally {
            setLoading(false);
        }
    }, [dateKey]);

    useEffect(() => { fetchGoals(); }, [fetchGoals]);

    const handleAdd = async () => {
        if (!newTitle.trim() || !dateKey) return;
        try {
            const goal = await api.addGoal(dateKey, newTitle.trim());
            setGoals(prev => [...prev, goal]);
            setNewTitle('');
        } catch {
            toast.error('Failed to add goal');
        }
    };

    const handleToggle = async (goal) => {
        try {
            const updated = await api.updateGoal(goal.id, { completed: !goal.completed });
            setGoals(prev => prev.map(g => g.id === goal.id ? updated : g));
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleSaveNote = async (goalId) => {
        try {
            const updated = await api.updateGoal(goalId, { note: noteText });
            setGoals(prev => prev.map(g => g.id === goalId ? updated : g));
            setEditingNote(null);
            setNoteText('');
            toast.success('Note saved');
        } catch {
            toast.error('Failed to save note');
        }
    };

    const handleDelete = async (goal) => {
        try {
            await api.deleteGoal(goal.id);
            setGoals(prev => prev.filter(g => g.id !== goal.id));
        } catch {
            toast.error('Failed to delete');
        }
    };

    // Filter upcoming events for the current month
    const upcomingEvents = useMemo(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const items = [];

        Object.entries(allEvents || {}).forEach(([dk, evts]) => {
            const d = new Date(dk + 'T00:00:00');
            if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && dk >= today.toLocaleDateString('sv-SE')) {
                evts.forEach(e => items.push({ ...e, dateKey: dk }));
            }
        });
        return items.sort((a, b) => a.dateKey.localeCompare(b.dateKey)).slice(0, 4);
    }, [allEvents]);

    if (!day) return null;

    // Format date and day name
    const dateObj = new Date(dateKey + 'T00:00:00');
    const MM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const DD = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${MM}/${DD}`;
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    // Correct comparison for 'Today'
    const isTodayDate = dateKey === new Date().toLocaleDateString('sv-SE');

    return (
        <div className="goal-sidebar anim-fade-in">
            <div className="goal-sidebar__header">
                <span className="goal-sidebar__date">{dateStr}</span>
                <span className="goal-sidebar__day">{dayName}</span>
            </div>

            <div className="goal-sidebar__content">
                <div className="goal-sidebar__section">
                    <h3 className="goal-sidebar__title">GOALS FOR THE DAY :</h3>

                    <div className="goal-sidebar__list">
                        {goals.map(goal => (
                            <div key={goal.id} className="goal-sidebar__item-container">
                                <div className={`goal-sidebar__item ${goal.completed ? 'goal-sidebar__item--done' : ''}`}>
                                    <button
                                        className={`goal-sidebar__checkbox ${goal.completed ? 'goal-sidebar__checkbox--checked' : ''}`}
                                        onClick={() => handleToggle(goal)}
                                    >
                                        {goal.completed && <Check size={10} strokeWidth={4} />}
                                    </button>
                                    <span
                                        className="goal-sidebar__goal-title"
                                        onClick={() => {
                                            setEditingNote(goal.id);
                                            setNoteText(goal.note || '');
                                        }}
                                    >
                                        {goal.title}
                                    </span>
                                    <button className="goal-sidebar__delete" onClick={() => handleDelete(goal)}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                {editingNote === goal.id ? (
                                    <div className="goal-sidebar__note-edit">
                                        <textarea
                                            className="goal-sidebar__note-input"
                                            value={noteText}
                                            onChange={e => setNoteText(e.target.value)}
                                            placeholder="Add notes..."
                                            autoFocus
                                        />
                                        <div className="goal-sidebar__note-actions">
                                            <button onClick={() => setEditingNote(null)}>Cancel</button>
                                            <button className="btn-primary" onClick={() => handleSaveNote(goal.id)}>Save</button>
                                        </div>
                                    </div>
                                ) : goal.note && (
                                    <div className="goal-sidebar__note-display" onClick={() => {
                                        setEditingNote(goal.id);
                                        setNoteText(goal.note);
                                    }}>
                                        {goal.note}
                                    </div>
                                )}
                            </div>
                        ))}
                        {goals.length === 0 && !loading && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', textAlign: 'center', margin: '0.75rem 0' }}>
                                {isTodayDate
                                    ? 'No goals for today. Add one below!'
                                    : 'No goals recorded for this day.'}
                            </p>
                        )}
                    </div>

                    {isTodayDate && (
                        <div className="goal-sidebar__add">
                            <input
                                type="text"
                                placeholder="Add new goal..."
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            />
                            <button onClick={handleAdd}>
                                <Plus size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Events section - always visible */}
                <div className="goal-sidebar__section goal-sidebar__section--upcoming">
                    <h3 className="goal-sidebar__title">UPCOMING EVENTS :</h3>
                    {upcomingEvents.length > 0 ? (
                        <div className="goal-sidebar__upcoming-list">
                            {upcomingEvents.map(evt => (
                                <div key={evt.id} className="goal-sidebar__upcoming-item">
                                    <div className="goal-sidebar__upcoming-dot" style={{ backgroundColor: evt.color || 'var(--accent)' }} />
                                    <div className="goal-sidebar__upcoming-info">
                                        <span className="goal-sidebar__upcoming-title">{evt.title}</span>
                                        <span className="goal-sidebar__upcoming-date">
                                            {new Date(evt.dateKey + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', textAlign: 'center', margin: '0.5rem 0', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                            No upcoming events. Click a future date to add one.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
