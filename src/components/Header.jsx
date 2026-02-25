import { Link } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { logout } = useAuth();

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <Link to="/" className="site-logo">KING DIARIES</Link>
                <div className="site-header__actions">
                    <Link to="/settings" className="icon-btn icon-btn--profile" title="Settings">
                        <div className="profile-circle" />
                    </Link>
                    <button className="icon-btn" title="Sign out" onClick={logout}>
                        <div className="nav-arrow-right" />
                    </button>
                </div>
            </div>
        </header>
    );
}
