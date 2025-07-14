import React, { useState } from 'react';
import api from '../api/clientApi';
import { Box, TextField, Button, Typography, Alert, Stack, Paper } from '@mui/material';

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/register', { email, password });
      setSuccess('Registration successful! You can now log in.');
      onRegister && onRegister();
    } catch (err) {
      setError('Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ fontWeight: 'bold', letterSpacing: 1 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </Box>
    </Paper>
  );
};

export default RegisterForm;
