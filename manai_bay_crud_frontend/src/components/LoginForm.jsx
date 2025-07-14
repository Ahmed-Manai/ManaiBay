
// Login form component for user authentication
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import { Box, TextField, Button, Typography, Alert, Stack, Paper } from '@mui/material';

const LoginForm = ({ onLogin }) => {
  // State for form fields and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      window.localStorage.setItem('token', res.data.access_token);
      window.localStorage.setItem('role', res.data.role);
      onLogin(res.data.access_token, res.data.role);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
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
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Box>
    </Paper>
  );

// Prop types for type safety
LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
};

export default LoginForm;
