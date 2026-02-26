import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { login as apiLogin, signUp as apiSignUp } from '../lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        if (isSignUp && !name.trim()) return;

        setLoading(true);
        setError('');
        try {
            if (isSignUp) {
                await apiSignUp(email, password, name);
                toast.success(`Welcome, ${name}! ✨`);
            } else {
                await apiLogin(email, password);
                toast.success('Welcome back! ✨');
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-login">
            <div className="login-box">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <BookOpen size={22} color="var(--cyan)" />
                    <div className="login-logo" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>King Diaries</div>
                </div>
                <div className="login-tagline">Visual Autography of My Journey.</div>

                {/* Card */}
                <div className="login-card anim-scale-in">
                    <div className="login-title">{isSignUp ? 'Create Account' : 'Welcome back'}</div>
                    <div className="login-sub">{isSignUp ? 'Join King Diaries to start your journey.' : 'Enter your credentials to continue.'}</div>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div className="login-field">
                                <label className="field-label">Full Name</label>
                                <input
                                    className="text-input"
                                    type="text"
                                    placeholder="e.g. Kavya"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}
                        <div className="login-field">
                            <label className="field-label">Email Address</label>
                            <input
                                className="text-input"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                        <div className="login-field">
                            <label className="field-label">Password</label>
                            <input
                                className="text-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                autoComplete={isSignUp ? "new-password" : "current-password"}
                            />
                        </div>
                        <button className="btn-login" type="submit" disabled={loading}>
                            {loading ? 'Processing…' : (isSignUp ? 'Sign Up →' : 'Sign In →')}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        <button
                            className="link-btn"
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{ color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                    Secure cloud storage via Firebase — accessible anywhere.
                </p>
            </div>
        </div>
    );
}
