import React, { useEffect, useState } from 'react';
import { createClient, updateClient } from '../api/clientApi';
import {
  Box, TextField, Button, Typography, Stack
} from '@mui/material';

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
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {editClient ? 'Edit Client' : 'Add New Client'}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            {editClient ? 'Update' : 'Create'}
          </Button>
          {editClient && (
            <Button variant="outlined" color="secondary" onClick={clearEdit}>
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ClientForm;
