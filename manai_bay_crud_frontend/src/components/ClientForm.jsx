import React, { useState } from 'react';
import { createClient } from '../api/clientApi';

const ClientForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createClient({ name, email });
    setName('');
    setEmail('');
    onCreated(); // Refresh list
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Client</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <button type="submit">Create</button>
    </form>
  );
};

export default ClientForm;
