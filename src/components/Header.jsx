import { Link } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';

export default function Header() {
    return (
        <header className="w-full px-4 sm:px-6">
            <div className="flex flex-row items-center justify-between px-4 py-3 mt-4 max-w-7xl mx-auto">
                <nav className="flex gap-4 items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-text-primary font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
                    >
                        <BookOpen className="w-5 h-5 text-accent" />
                        <span>Archivist</span>
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    <Link
                        to="/settings"
                        className="p-2 rounded-lg hover:bg-surface-raised transition-colors text-text-secondary hover:text-text-primary"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
