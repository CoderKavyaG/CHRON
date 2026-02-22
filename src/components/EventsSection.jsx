import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import * as api from '../lib/api';
import toast from 'react-hot-toast';

const EVENT_COLORS = [
    { label: 'Cyan', value: '#22D3EE' },
    { label: 'Green', value: '#22C55E' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Orange', value: '#FB923C' },
    { label: 'Pink', value: '#EC4899' },
];

export default function EventsSection({ dateKey }) {
    const [events, setEvents] = useState([]);
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', description: '', color: '#22D3EE' });

    const fetchEvents = useCallback(async () => {
        try {
            const data = await api.getEventsDay(dateKey);
            setEvents(data || []);
        } finally {
            setLoading(false);
        }
    }, [dateKey]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    const handleAdd = async () => {
        if (!form.title.trim()) return;
        try {
            const evt = await api.addEvent(dateKey, form.title.trim(), form.description.trim(), form.color);
            setEvents(prev => [...prev, evt]);
            setForm({ title: '', description: '', color: '#22D3EE' });
            setAdding(false);
            toast.success('Event added 📅');
        } catch {
            toast.error('Failed to add event');
        }
    };

    const handleDelete = async (evt) => {
        try {
            await api.deleteEvent(evt.id);
            setEvents(prev => prev.filter(e => e.id !== evt.id));
            toast.success('Event removed');
        } catch {
            toast.error('Failed to delete');
        }
    };

    if (loading) return (
        <div style={{ padding: '0 1.25rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
            Loading events…
        </div>
    );

    return (
        <div className="goals-section">
            <div className="goals-section__header">
                <span className="goals-section__title">
                    <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Events & Plans {events.length > 0 && `(${events.length})`}
                </span>
                <button className="goals-section__add-btn" onClick={() => setAdding(a => !a)}>
                    <Plus size={13} /> Add event
                </button>
            </div>

            {/* Event list */}
            {events.length > 0 && (
                <div className="goal-list">
                    {events.map(evt => (
                        <div key={evt.id} className="goal-item" style={{ borderLeft: `3px solid ${evt.color}` }}>
                            <div style={{ flex: 1 }}>
                                <div className="goal-title">{evt.title}</div>
                                {evt.description && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
                                        {evt.description}
                                    </div>
                                )}
                            </div>
                            <button className="goal-delete" onClick={() => handleDelete(evt)} style={{ opacity: 1 }}>
                                <Trash2 size={11} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add form */}
            {adding && (
                <div style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.875rem',
                    marginTop: '0.375rem',
                }}>
                    <input
                        className="goal-input"
                        placeholder="Event title"
                        value={form.title}
                        autoFocus
                        style={{ marginBottom: '0.5rem', width: '100%' }}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    />
                    <input
                        className="goal-input"
                        placeholder="Description (optional)"
                        value={form.description}
                        style={{ marginBottom: '0.625rem', width: '100%' }}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                    {/* Color picker */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color</span>
                        {EVENT_COLORS.map(c => (
                            <button
                                key={c.value}
                                onClick={() => setForm(f => ({ ...f, color: c.value }))}
                                style={{
                                    width: 18, height: 18, borderRadius: '50%',
                                    background: c.value, border: 'none', cursor: 'pointer',
                                    outline: form.color === c.value ? `2px solid ${c.value}` : 'none',
                                    outlineOffset: '2px',
                                }}
                                title={c.label}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="goal-add-submit" style={{ flex: 1 }} onClick={handleAdd}>
                            Add Event
                        </button>
                        <button className="btn-cancel" onClick={() => { setAdding(false); setForm({ title: '', description: '', color: '#22D3EE' }); }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {!loading && events.length === 0 && !adding && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>
                    No events planned. Add one above!
                </p>
            )}
        </div>
    );
}
