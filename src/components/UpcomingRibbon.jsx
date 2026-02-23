import { useEffect, useState, useMemo } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import * as api from '../lib/api';

function formatRelative(dateKey) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateKey + 'T00:00:00');
    const diff = Math.round((d - today) / 86400000);
    if (diff === 1) return 'Tomorrow';
    if (diff === 0) return 'Today';
    if (diff <= 6) return `In ${diff} days`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function UpcomingRibbon({ events }) {
    const today = new Date().toISOString().slice(0, 10);

    const upcoming = useMemo(() => {
        const flat = [];
        Object.entries(events).forEach(([dateKey, evts]) => {
            if (dateKey >= today) {
                evts.forEach(e => flat.push({ ...e, dateKey }));
            }
        });
        return flat
            .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
            .slice(0, 5);
    }, [events, today]);

    if (upcoming.length === 0) return null;

    return (
        <div className="upcoming-ribbon anim-fade-in">
            <div className="upcoming-ribbon__label">
                <Calendar size={12} />
                Upcoming
            </div>
            <div className="upcoming-ribbon__list">
                {upcoming.map((e, i) => (
                    <div key={e.id} className="upcoming-ribbon__item">
                        <span
                            className="upcoming-ribbon__dot"
                            style={{ background: e.color || 'var(--cyan)' }}
                        />
                        <span className="upcoming-ribbon__title">{e.title}</span>
                        <span className="upcoming-ribbon__date">{formatRelative(e.dateKey)}</span>
                        {i < upcoming.length - 1 && (
                            <ChevronRight size={10} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
