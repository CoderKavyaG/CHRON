import { useMemo } from 'react';
import { Flame, TrendingUp, Calendar, Star } from 'lucide-react';
import { LEGEND_CONFIG, Legend } from '../lib/constants';

export default function StatsBar({ stats }) {
    const statItems = useMemo(
        () => [
            {
                label: 'Total Entries',
                value: stats.total,
                icon: Calendar,
                color: '#8B5CF6',
            },
            {
                label: 'Current Streak',
                value: `${stats.streakCurrent}d`,
                icon: Flame,
                color: '#F97316',
            },
            {
                label: 'Longest Streak',
                value: `${stats.streakLongest}d`,
                icon: TrendingUp,
                color: '#22C55E',
            },
            {
                label: 'Core Memories',
                value: stats.coreMomory,
                icon: Star,
                color: '#22D3EE',
            },
        ],
        [stats]
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
            {statItems.map((item) => (
                <div
                    key={item.label}
                    className="glass-card rounded-xl p-4 flex items-center gap-3 group hover:border-border-hover transition-all duration-300"
                >
                    <div
                        className="p-2 rounded-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: item.color + '15' }}
                    >
                        <item.icon
                            className="w-4 h-4"
                            style={{ color: item.color }}
                        />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-text-primary">
                            {item.value}
                        </div>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider">
                            {item.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
