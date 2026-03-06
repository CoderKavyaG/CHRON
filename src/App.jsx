import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';

// Protected route wrapper — redirects to landing if not authenticated
function Protected({ children }) {
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/" replace />;
}

// Public route — redirects to /app if already authenticated
function PublicOnly({ children }) {
  const { authed } = useAuth();
  return authed ? <Navigate to="/app" replace /> : children;
}

function AppShell() {
  const { authed } = useAuth();

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#1E1E22',
            color: '#F2F2F4',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '10px',
            fontSize: '0.875rem',
          },
        }}
      />

      {authed && <Header />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<PublicOnly><LandingPage /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/app" element={<Protected><HomePage /></Protected>} />
          <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {authed && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
