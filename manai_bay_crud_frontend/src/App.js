
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CssBaseline } from '@mui/material';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/ecommerce/Header';


function App() {
  const [refresh, setRefresh] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem('token'));
  const [role, setRole] = useState(() => window.localStorage.getItem('role'));
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role !== 'admin') {
      navigate('/ecommerce');
    }
  }, [token, role, navigate]);

  const handleLogin = (jwt, userRole) => {
    window.localStorage.setItem('token', jwt);
    window.localStorage.setItem('role', userRole);
    setToken(jwt);
    setRole(userRole);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  if (!token) {
    return (
      <>
        <CssBaseline />
        <Header onLogout={handleLogout} />
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
                  Back to Login
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
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  // Role-based routing
  if (role === 'admin') {
    return (
      <>
        <CssBaseline />
        <Header onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Client Manager
          </Typography>
          <ClientForm
            onCreated={() => setRefresh(!refresh)}
            editClient={editClient}
            clearEdit={() => setEditClient(null)}
          />
          <ClientList
            refreshTrigger={refresh}
            onEdit={(client) => setEditClient(client)}
          />
        </Container>
      </>
    );
  }

  // Normal user: show E-commerce page (replace with your actual component)
  return (
    <>
      <CssBaseline />
      <Header onLogout={handleLogout} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          E-commerce Page
        </Typography>
        {/* Replace below with your actual E-commerce component */}
        <Typography variant="body1">Welcome to the E-commerce page!</Typography>
      </Container>
    </>
  );
}

export default App;
