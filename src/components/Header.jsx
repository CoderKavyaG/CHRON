import { Link } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { logout } = useAuth();

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <Link to="/" className="site-logo">Archivist</Link>
                <div className="site-header__actions">
                    <Link to="/settings" className="icon-btn" title="Settings">
                        <Settings size={16} />
                    </Link>
                    <button className="icon-btn" title="Sign out" onClick={logout}>
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}
