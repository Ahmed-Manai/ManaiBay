import React, { useState, useEffect } from 'react';
import { createClient, updateClient } from '../api/clientApi';

const ClientForm = ({ onCreated, editClient, clearEdit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (editClient) {
      setName(editClient.name);
      setEmail(editClient.email);
    }
  }, [editClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editClient) {
      await updateClient(editClient.id, { name, email });
      clearEdit();
    } else {
      await createClient({ name, email });
    }
    setName('');
    setEmail('');
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editClient ? 'Edit Client' : 'Add Client'}</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <button type="submit">{editClient ? 'Update' : 'Create'}</button>
      {editClient && <button type="button" onClick={clearEdit}>Cancel</button>}
    </form>
  );
};

export default ClientForm;
