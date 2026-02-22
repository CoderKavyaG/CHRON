import { useState, useEffect, useCallback } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import * as api from '../lib/api';
import toast from 'react-hot-toast';

export default function GoalsSection({ dateKey, readOnly = false }) {
    const [goals, setGoals] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchGoals = useCallback(async () => {
        try {
            const data = await api.getGoalsDay(dateKey);
            setGoals(data || []);
        } finally {
            setLoading(false);
        }
    }, [dateKey]);

    useEffect(() => { fetchGoals(); }, [fetchGoals]);

    const handleAdd = async () => {
        if (!newTitle.trim()) return;
        try {
            const goal = await api.addGoal(dateKey, newTitle.trim());
            setGoals(prev => [...prev, goal]);
            setNewTitle('');
            setAdding(false);
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

    const handleDelete = async (goal) => {
        try {
            await api.deleteGoal(goal.id);
            setGoals(prev => prev.filter(g => g.id !== goal.id));
        } catch {
            toast.error('Failed to delete');
        }
    };

    const done = goals.filter(g => g.completed).length;
    const total = goals.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    if (loading) return (
        <div className="goals-section">
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Loading goals…</p>
        </div>
    );

    return (
        <div className="goals-section">
            <div className="goals-section__header">
                <span className="goals-section__title">
                    🎯 Goals & Tasks {total > 0 && `(${done}/${total})`}
                </span>
                {!readOnly && (
                    <button className="goals-section__add-btn" onClick={() => setAdding(a => !a)}>
                        <Plus size={13} /> Add goal
                    </button>
                )}
            </div>

            {/* Progress bar */}
            {total > 0 && (
                <div className="goals-progress">
                    <div className="goals-progress__bar">
                        <div className="goals-progress__fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="goals-progress__label">
                        {pct === 100 ? '🎉 All done!' : `${pct}% complete`}
                    </div>
                </div>
            )}

            {/* Goal list */}
            {goals.length > 0 && (
                <div className="goal-list">
                    {goals.map(goal => (
                        <div key={goal.id} className={`goal-item ${goal.completed ? 'goal-item--done' : ''}`}>
                            <button
                                className={`goal-checkbox ${goal.completed ? 'goal-checkbox--checked' : ''}`}
                                onClick={() => !readOnly && handleToggle(goal)}
                                disabled={readOnly}
                            >
                                {goal.completed && <Check size={10} strokeWidth={3} />}
                            </button>
                            <span className={`goal-title ${goal.completed ? 'goal-title--done' : ''}`}>
                                {goal.title}
                            </span>
                            {!readOnly && (
                                <button className="goal-delete" onClick={() => handleDelete(goal)}>
                                    <Trash2 size={11} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add input */}
            {adding && !readOnly && (
                <div className="goal-add-row">
                    <input
                        className="goal-input"
                        placeholder="What do you want to accomplish?"
                        value={newTitle}
                        autoFocus
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleAdd();
                            if (e.key === 'Escape') { setAdding(false); setNewTitle(''); }
                        }}
                    />
                    <button className="goal-add-submit" onClick={handleAdd}>Add</button>
                </div>
            )}

            {/* Empty state */}
            {!loading && total === 0 && !adding && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: '0.25rem' }}>
                    No goals set. {!readOnly && 'Add one above!'}
                </p>
            )}
        </div>
    );
}
