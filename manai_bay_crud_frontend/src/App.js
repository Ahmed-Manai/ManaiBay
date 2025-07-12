import React, { useState } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editClient, setEditClient] = useState(null);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>User CRUD (React + FastAPI)</h1>

      <ClientForm
        onCreated={() => setRefresh(!refresh)}
        editClient={editClient}
        clearEdit={() => setEditClient(null)}
      />

      <ClientList
        refreshTrigger={refresh}
        onEdit={(client) => setEditClient(client)}
      />
    </div>
  );
}

export default App;
