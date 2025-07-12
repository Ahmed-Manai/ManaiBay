import React, { useState } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>User CRUD (React + FastAPI)</h1>
      <ClientForm onCreated={() => setRefresh(!refresh)} />
      <ClientList key={refresh} onEdit={() => {}} />
    </div>
  );
}

export default App;
