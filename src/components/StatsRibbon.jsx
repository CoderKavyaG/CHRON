import { useEffect, useState } from 'react';
import { Flame, BookOpen, TrendingUp } from 'lucide-react';
import * as api from '../lib/api';
import { LEGEND_CONFIG } from '../lib/constants';

function computeStreak(entries) {
    const today = new Date();
    let streak = 0;
    let d = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    while (true) {
        const key = d.toISOString().slice(0, 10);
        if (entries[key]) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            // Allow today to be missing (it's still today)
            if (streak === 0 && key === today.toISOString().slice(0, 10)) {
                d.setDate(d.getDate() - 1);
                continue;
            }
            break;
        }
    }
    return streak;
}

function computeMoodCounts(entries) {
    const counts = {};
    Object.values(entries).forEach(e => {
        counts[e.legend] = (counts[e.legend] || 0) + 1;
    });
    return counts;
}

export default function StatsRibbon({ entries }) {
    const total = Object.keys(entries).length;
    const streak = computeStreak(entries);
    const counts = computeMoodCounts(entries);

    if (total === 0) return null;

    // Mood bar segments
    const moodOrder = ['CORE_MEMORY', 'GOOD_DAY', 'NEUTRAL', 'BAD_DAY', 'NIGHTMARE'];

    return (
        <div className="stats-ribbon anim-fade-in">
            {/* Streak */}
            <div className="stats-ribbon__stat">
                <Flame size={14} className="stats-ribbon__icon" style={{ color: '#FB923C' }} />
                <span className="stats-ribbon__value">{streak}</span>
                <span className="stats-ribbon__label">day streak</span>
            </div>

            {/* Total entries */}
            <div className="stats-ribbon__stat">
                <BookOpen size={14} className="stats-ribbon__icon" style={{ color: 'var(--cyan)' }} />
                <span className="stats-ribbon__value">{total}</span>
                <span className="stats-ribbon__label">entries</span>
            </div>

            {/* Mood bar */}
            <div className="stats-ribbon__mood">
                <TrendingUp size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                <div className="stats-ribbon__bar" title="Mood distribution">
                    {moodOrder.map(key => {
                        const count = counts[key] || 0;
                        if (count === 0) return null;
                        const pct = (count / total) * 100;
                        const cfg = LEGEND_CONFIG[key];
                        return (
                            <div
                                key={key}
                                className="stats-ribbon__bar-seg"
                                style={{ width: `${pct}%`, background: cfg.color }}
                                title={`${cfg.label}: ${count} day${count !== 1 ? 's' : ''}`}
                            />
                        );
                    })}
                </div>
                <span className="stats-ribbon__label" style={{ whiteSpace: 'nowrap' }}>
                    {Math.round(((counts['CORE_MEMORY'] || 0) + (counts['GOOD_DAY'] || 0)) / total * 100)}% positive
                </span>
            </div>
        </div>
    );
}
