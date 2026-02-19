import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Upload, Plus, X, Trash2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    getSettings,
    saveSettings,
    getCustomCategories,
    addCustomCategory,
    removeCustomCategory,
    exportData,
    importData,
} from '../lib/storage';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [settings, setSettings] = useState(getSettings());
    const [categories, setCategories] = useState(getCustomCategories());
    const [newCatName, setNewCatName] = useState('');

    const handleSaveSettings = () => {
        saveSettings(settings);
        toast.success('Settings saved!', {
            style: {
                background: '#1E1E24',
                color: '#F5F5F7',
                border: '1px solid rgba(255,255,255,0.08)',
            },
        });
    };

    const handleAddCategory = () => {
        if (!newCatName.trim()) return;
        const cat = addCustomCategory(newCatName.trim());
        setCategories(getCustomCategories());
        setNewCatName('');
        toast.success(`Category "${cat.name}" added!`, {
            style: {
                background: '#1E1E24',
                color: '#F5F5F7',
                border: '1px solid rgba(255,255,255,0.08)',
            },
        });
    };

    const handleRemoveCategory = (id, name) => {
        removeCustomCategory(id);
        setCategories(getCustomCategories());
        toast.success(`Category "${name}" removed`, {
            style: {
                background: '#1E1E24',
                color: '#F5F5F7',
                border: '1px solid rgba(255,255,255,0.08)',
            },
        });
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `archivist-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported!', {
            icon: '📦',
            style: {
                background: '#1E1E24',
                color: '#F5F5F7',
                border: '1px solid rgba(255,255,255,0.08)',
            },
        });
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    importData(data);
                    setSettings(getSettings());
                    setCategories(getCustomCategories());
                    toast.success('Data imported successfully!', {
                        icon: '✅',
                        style: {
                            background: '#1E1E24',
                            color: '#F5F5F7',
                            border: '1px solid rgba(255,255,255,0.08)',
                        },
                    });
                } catch {
                    toast.error('Invalid backup file', {
                        style: {
                            background: '#1E1E24',
                            color: '#F5F5F7',
                            border: '1px solid rgba(255,255,255,0.08)',
                        },
                    });
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
            {/* Back navigation */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Journal
            </Link>

            <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

            {/* Profile Section */}
            <section className="glass-card rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Your Name
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        value={settings.name || ''}
                        onChange={(e) =>
                            setSettings((s) => ({ ...s, name: e.target.value }))
                        }
                        placeholder="Enter your name"
                    />
                </div>
                <button onClick={handleSaveSettings} className="btn-primary flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save Profile
                </button>
            </section>

            {/* Custom Categories */}
            <section className="glass-card rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">
                    Custom Categories
                </h2>
                <p className="text-xs text-text-muted">
                    Add your own review categories beyond Work, Personal, and Learning.
                </p>

                {/* Existing Categories */}
                {categories.length > 0 && (
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border"
                            >
                                <span className="text-sm text-text-primary">📌 {cat.name}</span>
                                <button
                                    onClick={() => handleRemoveCategory(cat.id, cat.name)}
                                    className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Category */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input-field flex-1"
                        placeholder="Category name..."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button
                        onClick={handleAddCategory}
                        className="btn-primary flex items-center gap-1.5 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </section>

            {/* Data Management */}
            <section className="glass-card rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-text-primary">
                    Data Management
                </h2>
                <p className="text-xs text-text-muted">
                    Export your data as a JSON backup or import from a previous backup.
                    Your data is stored locally in your browser.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border hover:border-border-hover transition-colors text-sm font-medium text-text-primary"
                    >
                        <Download className="w-4 h-4 text-accent" />
                        Export Backup
                    </button>
                    <button
                        onClick={handleImport}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border hover:border-border-hover transition-colors text-sm font-medium text-text-primary"
                    >
                        <Upload className="w-4 h-4 text-green-400" />
                        Import Backup
                    </button>
                </div>
            </section>

            {/* Info */}
            <section className="glass-card rounded-xl p-6 space-y-2">
                <h2 className="text-lg font-semibold text-text-primary">About</h2>
                <p className="text-sm text-text-secondary">
                    Archivist is your personal journal — a visual autobiography of your
                    emotional journey. Every square holds a memory, every color tells a
                    story.
                </p>
                <p className="text-xs text-text-muted">
                    All data is stored locally in your browser. No server, no sign-in,
                    no tracking — just you and your thoughts.
                </p>
            </section>
        </div>
    );
}
