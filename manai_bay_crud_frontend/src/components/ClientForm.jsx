
// Form component for creating or editing a client
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import {
  Box, TextField, Button, Typography, Stack
} from '@mui/material';

const ClientForm = ({ onCreated, editClient, clearEdit }) => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Populate form fields if editing an existing client
  useEffect(() => {
    if (editClient) {
      setName(editClient.name);
      setEmail(editClient.email);
    }
  }, [editClient]);

  // Handle form submission for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editClient) {
      await api.updateClient(editClient.id, { name, email });
      clearEdit();
    } else {
      await api.createClient({ name, email });
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

// Prop types for type safety
ClientForm.propTypes = {
  onCreated: PropTypes.func.isRequired,
  editClient: PropTypes.object,
  clearEdit: PropTypes.func.isRequired,
};
};

export default ClientForm;
