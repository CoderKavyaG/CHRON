import { LEGEND_CONFIG, DEFAULT_COLOR } from '../lib/constants';

export default function MoodLegend() {
    return (
        <div className="glass-card rounded-xl p-4 animate-fade-in w-full">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
                Mood Legend
            </h3>
            <div className="space-y-2.5">
                {Object.entries(LEGEND_CONFIG).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2.5">
                        <div
                            className="w-3.5 h-3.5 rounded-[3px] flex-shrink-0"
                            style={{ backgroundColor: config.color }}
                        />
                        <span className="text-text-secondary text-sm">{config.label}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-3.5 h-3.5 rounded-[3px] flex-shrink-0"
                        style={{ backgroundColor: DEFAULT_COLOR }}
                    />
                    <span className="text-text-secondary text-sm">No Entry</span>
                </div>
            </div>
        </div>
    );
}
