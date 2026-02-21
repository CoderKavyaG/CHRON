import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { login as apiLogin } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) return;
        setLoading(true);
        setError('');
        try {
            await apiLogin(password);
            login();
            toast.success('Welcome back! ✨');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Wrong password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-login">
            <div className="login-box">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <BookOpen size={22} color="var(--cyan)" />
                    <div className="login-logo">Archivist</div>
                </div>
                <div className="login-tagline">Your personal emotional archive.</div>

                {/* Card */}
                <div className="login-card anim-scale-in">
                    <div className="login-title">Welcome back</div>
                    <div className="login-sub">Enter your password to continue.</div>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label className="field-label">Password</label>
                            <input
                                className="text-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                autoFocus
                                autoComplete="current-password"
                            />
                        </div>
                        <button className="btn-login" type="submit" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In →'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                    Personal journal — no registration, no tracking.
                </p>
            </div>
        </div>
    );
}
