import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Logout failed', err);
        }
    }, []);

    return (
        <AuthCtx.Provider value={{ user, authed: !!user, loading, logout }}>
            {!loading && children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);
