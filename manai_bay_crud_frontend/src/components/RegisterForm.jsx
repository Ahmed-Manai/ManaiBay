
// Registration form component for new users
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import { Box, TextField, Button, Typography, Alert, Stack, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const RegisterForm = ({ onRegister }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  // State for form fields, error, and success messages
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple validation for required fields
  const validate = () => {
    if (!firstName || !lastName || !email || !password || !phone || !location) {
      setError(t('all_fields_required', 'All fields are required.'));
      return false;
    }
    // Email format validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError(t('invalid_email', 'Please enter a valid email address.'));
      return false;
    }
    // Phone format validation (simple)
    if (!/^\+?\d{7,15}$/.test(phone)) {
      setError(t('invalid_phone', 'Please enter a valid phone number.'));
      return false;
    }
    return true;
  };

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        location
      });
      setSuccess(t('registration_success', 'Registration successful! You can now log in.'));
      onRegister && onRegister();
    } catch (err) {
      setError(t('registration_failed', 'Registration failed. Email may already be registered.'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%', boxShadow: '0 8px 32px rgba(25, 118, 210, 0.12)' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', mb: 2, letterSpacing: 1 }}>
          {t('register', 'Register')}
        </Typography>
        <Stack spacing={2} sx={{ width: '100%' }}>
          {/* First Name */}
          <TextField
            label={t('first_name', 'First Name')}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
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
          {/* Last Name */}
          <TextField
            label={t('last_name', 'Last Name')}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
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
          {/* Email */}
          <TextField
            label={t('email', 'Email')}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          {/* Password */}
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
          {/* Phone Number */}
          <TextField
            label={t('phone_number', 'Phone Number')}
            value={phone}
            onChange={e => setPhone(e.target.value)}
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
          {/* Location */}
          <TextField
            label={t('location', 'Location')}
            value={location}
            onChange={e => setLocation(e.target.value)}
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
            {loading ? t('registering', 'Registering...') : t('register', 'Register')}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}
        </Stack>
      </Box>
    </Paper>
  );
}

// Prop types for type safety
RegisterForm.propTypes = {
  onRegister: PropTypes.func,
};

export default RegisterForm;
