import { createContext, useContext, useState, useCallback } from 'react';
import { isAuthenticated, logout as apiLogout } from '../lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [authed, setAuthed] = useState(isAuthenticated);

    const login = useCallback(() => setAuthed(true), []);
    const logout = useCallback(() => { apiLogout(); setAuthed(false); }, []);

    return (
        <AuthCtx.Provider value={{ authed, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);
