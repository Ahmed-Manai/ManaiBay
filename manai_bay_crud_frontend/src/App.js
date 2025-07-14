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
            <button onClick={() => setShowRegister(false)}>Back to Login</button>
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} />
            <button onClick={() => setShowRegister(true)}>Register</button>
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
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

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
