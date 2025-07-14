
// Form component for creating or editing a client
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import {
  Box, TextField, Button, Typography, Stack, Alert
} from '@mui/material';

const ClientForm = ({ onCreated, editClient, clearEdit }) => {
  // State for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Populate form fields if editing an existing client
  useEffect(() => {
    if (editClient) {
      setFirstName(editClient.first_name);
      setLastName(editClient.last_name);
      setEmail(editClient.email);
      setPhone(editClient.phone);
      setLocation(editClient.location);
      setPassword(''); // Don't prefill password for edit
    }
  }, [editClient]);

  // Error state for validation/API errors
  const [error, setError] = useState('');

  // Handle form submission for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editClient) {
        await api.updateClient(editClient.id, { first_name: firstName, last_name: lastName, email, phone, location });
        clearEdit();
      } else {
        await api.postRegister({ first_name: firstName, last_name: lastName, email, password, phone, location });
      }
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setLocation('');
      onCreated();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail));
      } else {
        setError('An error occurred. Please check your input and try again.');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {editClient ? 'Edit Client' : 'Add New Client'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack spacing={2}>
        <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        {!editClient && <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />}
        <TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
        <TextField label="Location" value={location} onChange={e => setLocation(e.target.value)} required />
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
