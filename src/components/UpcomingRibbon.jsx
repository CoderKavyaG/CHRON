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
                UPCOMING EVENTS FOR MONTH :
            </div>
            <div className="upcoming-ribbon__list">
                {upcoming.map((e) => (
                    <div key={e.id} className="upcoming-ribbon__item-box">
                        <span className="upcoming-ribbon__box-title">{e.title}</span>
                    </div>
                ))}
                <div className="upcoming-ribbon__arrow">
                    <div className="nav-arrow-right" />
                </div>
            </div>
        </div>
    );
}
