import React, { useState } from 'react';
import logo from './assets/1-2 - Copy.png';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/ecommerce/Header';
import Footer from './components/Footer';
import { CssBaseline } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleLogin = (token, role) => {
    if (role === 'admin') {
      navigate('/app');
    } else {
      navigate('/ecommerce');
    }
  };

  return (
    <>
      <CssBaseline />
      <Header minimal />
      <div
        style={{
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(120deg, #181a1b 0%, #232526 40%, #232526 100%)`
            : 'linear-gradient(120deg, #232526 0%, #414345 40%, #005bea 80%, #00c6fb 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logo} alt="Logo" style={{ width: 64, height: 64, borderRadius: 16, boxShadow: '0 2px 12px rgba(25, 118, 210, 0.2)' }} />
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : '#1976d2',
              letterSpacing: 1,
              fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
              textShadow: theme.palette.mode === 'dark' ? '0 2px 8px #0006' : '0 2px 8px #1976d233',
              transition: 'color 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            {t('welcome_to_manaibay', 'Welcome to ManaiBay')}
          </span>
        </div>
        <div style={{
          width: 400,
          maxWidth: '90vw',
          background: theme.palette.background.paper,
          borderRadius: 18,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.45)'
            : '0 8px 32px rgba(25, 118, 210, 0.18)',
          padding: '36px 32px 28px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.7s',
        }}>
          {showRegister ? (
            <>
              <RegisterForm onRegister={() => setShowRegister(false)} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <button
                  onClick={() => setShowRegister(false)}
                  style={{
                    background: 'none',
                    color: '#1976d2',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginTop: 8,
                  }}
                >
                  {t('back_to_login', 'Back to Login')}
                </button>
              </div>
            </>
          ) : (
            <>
              <LoginForm onLogin={handleLogin} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <button
                  onClick={() => setShowRegister(true)}
                  style={{
                    background: 'none',
                    color: '#1976d2',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginTop: 8,
                  }}
                >
                  {t('register', 'Register')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </>
  );
}

export default LoginPage;
