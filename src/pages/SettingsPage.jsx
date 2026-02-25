import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Upload, Plus, Trash2, Save, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { logout } = useAuth();
    const [settings, setSettings] = useState({ name: '' });
    const [cats, setCats] = useState([]);
    const [newCat, setNewCat] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getSettings(), api.getCategories()])
            .then(([s, c]) => { setSettings(s || {}); setCats(c || []); })
            .finally(() => setLoading(false));
    }, []);

    const doSaveSettings = async () => {
        try {
            await api.saveSettings(settings);
            toast.success('Settings saved!');
        } catch { toast.error('Failed to save'); }
    };

    const doAddCat = async () => {
        if (!newCat.trim()) return;
        try {
            await api.addCategory(newCat.trim());
            setCats(await api.getCategories());
            setNewCat('');
            toast.success('Category added');
        } catch { toast.error('Failed to add category'); }
    };

    const doRemoveCat = async (id, name) => {
        try {
            await api.removeCategory(id);
            setCats(c => c.filter(x => x.id !== id));
            toast.success(`"${name}" removed`);
        } catch { toast.error('Failed to remove'); }
    };

    const doExport = async () => {
        try {
            const data = await api.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = Object.assign(document.createElement('a'), {
                href: url,
                download: `king-diaries-${new Date().toISOString().split('T')[0]}.json`,
            });
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Exported! 📦');
        } catch { toast.error('Export failed'); }
    };

    const doImport = () => {
        const input = Object.assign(document.createElement('input'), {
            type: 'file', accept: '.json',
        });
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async ev => {
                try {
                    await api.importData(JSON.parse(ev.target.result));
                    const [s, c] = await Promise.all([api.getSettings(), api.getCategories()]);
                    setSettings(s); setCats(c);
                    toast.success('Data imported! ✅');
                } catch { toast.error('Invalid file'); }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    if (loading) return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-3)' }}>
            Loading settings…
        </div>
    );

    return (
        <div className="page-settings anim-fade-in">
            <Link to="/" className="settings-back">
                <ArrowLeft size={15} /> Back to Diaries
            </Link>

            <h1 className="settings-h1">Settings</h1>

            {/* Profile */}
            <div className="settings-card">
                <h2>Profile</h2>
                <p>Personalize your journal.</p>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="field-label">Your Name</label>
                    <input
                        className="text-input"
                        type="text"
                        placeholder="Enter your name"
                        value={settings.name || ''}
                        onChange={e => setSettings(s => ({ ...s, name: e.target.value }))}
                    />
                </div>
                <button className="btn-outline" onClick={doSaveSettings}>
                    <Save size={14} /> Save Profile
                </button>
            </div>

            {/* Custom categories */}
            <div className="settings-card">
                <h2>Custom Review Categories</h2>
                <p>Add your own categories beyond Work, Personal, Learning, and Health.</p>
                {cats.map(c => (
                    <div key={c.id} className="category-row">
                        <span>📌 {c.name}</span>
                        <button className="btn-remove" onClick={() => doRemoveCat(c.id, c.name)}>
                            <Trash2 size={13} />
                        </button>
                    </div>
                ))}
                <div className="add-cat-row">
                    <input
                        className="text-input"
                        type="text"
                        placeholder="Category name…"
                        value={newCat}
                        style={{ flex: 1 }}
                        onChange={e => setNewCat(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && doAddCat()}
                    />
                    <button className="btn-outline" onClick={doAddCat}>
                        <Plus size={14} /> Add
                    </button>
                </div>
            </div>

            {/* Data */}
            <div className="settings-card">
                <h2>Data Management</h2>
                <p>
                    Export a full JSON backup or restore from a previous one.
                    Your data lives on your personal server.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button className="btn-outline" onClick={doExport}>
                        <Download size={14} /> Export Backup
                    </button>
                    <button className="btn-outline" onClick={doImport}>
                        <Upload size={14} /> Import Backup
                    </button>
                </div>
            </div>

            {/* About */}
            <div className="settings-card">
                <h2>About King Diaries</h2>
                <p>
                    A visual autobiography of your emotional journey. Every square holds a memory,
                    every color tells a story. Built just for you — your data, your server.
                </p>
            </div>

            {/* Sign out */}
            <div style={{ marginTop: '0.5rem' }}>
                <button
                    className="btn-outline"
                    style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}
                    onClick={logout}
                >
                    <LogOut size={14} /> Sign Out
                </button>
            </div>
        </div>
    );
}
