import React, { useState } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import { Container, Typography } from '@mui/material';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editClient, setEditClient] = useState(null);

  return (
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
  );
}

export default App;
