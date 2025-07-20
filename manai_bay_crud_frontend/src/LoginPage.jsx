import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/ecommerce/Header';
import Footer from './components/Footer';
import { CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <div style={{ maxWidth: 400, margin: '2rem auto' }}>
        {showRegister ? (
          <>
            <RegisterForm onRegister={() => setShowRegister(false)} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <button
                onClick={() => setShowRegister(false)}
                style={{
                  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 32px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                  transition: 'background 0.3s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'}
              >
                {t('back_to_login', 'Back to Login')}
              </button>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <button
                onClick={() => setShowRegister(true)}
                style={{
                  background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 32px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                  transition: 'background 0.3s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'}
              >
                {t('register', 'Register')}
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default LoginPage;
