import { LEGEND_CONFIG, DEFAULT_COLOR } from '../lib/constants';

export default function MoodLegend({ inline = false }) {
    return (
        <div className={inline ? 'mood-legend--inline' : 'mood-legend'}>
            {!inline && (
                <div className="mood-legend__title">Mood Legend</div>
            )}
            <div className={inline ? 'mood-legend__list' : 'mood-legend__list'}
                style={inline ? { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem 1rem' } : {}}>
                {Object.entries(LEGEND_CONFIG).map(([key, config]) => (
                    <div key={key} className="mood-legend__item">
                        <div className="mood-legend__dot" style={{ backgroundColor: config.color }} />
                        <span className="mood-legend__label">{config.label}</span>
                    </div>
                ))}
                <div className="mood-legend__item">
                    <div className="mood-legend__dot" style={{ backgroundColor: DEFAULT_COLOR }} />
                    <span className="mood-legend__label">No Entry</span>
                </div>
            </div>
        </div>
    );
}
