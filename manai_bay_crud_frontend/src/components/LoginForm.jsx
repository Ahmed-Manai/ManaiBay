
// Login form component for user authentication
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import { Box, TextField, Button, Typography, Alert, Stack, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LoginForm = ({ onLogin }) => {
  const { t } = useTranslation();
  const theme = useTheme();
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
      window.localStorage.setItem('user_id', res.data.user_id);
      onLogin(res.data.access_token, res.data.role);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%', boxShadow: '0 8px 32px rgba(25, 118, 210, 0.12)' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', mb: 2, letterSpacing: 1 }}>
          {t('login', 'Login')}
        </Typography>
        <Stack spacing={2} sx={{ width: '100%' }}>
          {/* Email input */}
          <TextField
            label={t('email', 'Email')}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            autoFocus
            variant="outlined"
            sx={{
              borderRadius: 2,
              background: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f7fa',
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.secondary,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
          />
          {/* Password input */}
          <TextField
            label={t('password', 'Password')}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: 2,
              background: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f7fa',
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.secondary,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
            }}
            InputProps={{
              style: { color: theme.palette.text.primary },
            }}
            InputLabelProps={{
              style: { color: theme.palette.text.secondary },
            }}
          />
          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              letterSpacing: 1,
              py: 1.5,
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
              background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
              transition: 'background 0.3s',
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
              },
            }}
          >
            {loading ? t('logging_in', 'Logging in...') : t('login', 'Login')}
          </Button>
          {/* Error alert */}
          {error && <Alert severity="error" sx={{ mt: 1 }}>{t('invalid_credentials', error)}</Alert>}
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
