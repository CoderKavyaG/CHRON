import { Link } from 'react-router-dom';
import { Settings, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { logout } = useAuth();

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <Link to="/" className="site-logo">
                    <Crown size={20} strokeWidth={2.5} />
                    <span>KING DIARIES</span>
                </Link>
                <div className="site-header__actions">
                    <Link to="/settings" className="icon-btn" title="Settings">
                        <Settings size={18} />
                    </Link>
                    <button className="icon-btn" title="Sign out" onClick={logout}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
