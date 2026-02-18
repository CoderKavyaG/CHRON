import { Heart } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-text-muted text-sm">
                    Archivist &copy; {year}
                </p>
                <p className="text-text-muted text-sm flex items-center gap-1">
                    Built with{' '}
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />{' '}
                    by{' '}
                    <a
                        href="https://github.com/coderkavyag"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline font-medium"
                    >
                        Kavya
                    </a>
                </p>
            </div>
        </footer>
    );
}
