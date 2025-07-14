import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (jwt) => {
    window.localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
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
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Client Manager
      </Typography>
      {/* Modern styled logout button using Material-UI */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button
          onClick={handleLogout}
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
          Logout
        </button>
      </div>

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
  );
}

export default App;
