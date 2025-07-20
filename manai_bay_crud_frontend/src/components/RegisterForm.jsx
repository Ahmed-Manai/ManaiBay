
// Registration form component for new users
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import { Box, TextField, Button, Typography, Alert, Stack, Paper } from '@mui/material';
import LanguageSelector from './LanguageSelector';

const RegisterForm = ({ onRegister }) => {
  const { t } = useTranslation();
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
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <LanguageSelector />
      </Box>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          {t('register', 'Register')}
        </Typography>
        <Stack spacing={3}>
          <TextField
            label={t('first_name', 'First Name')}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label={t('last_name', 'Last Name')}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label={t('email', 'Email')}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label={t('password', 'Password')}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label={t('phone_number', 'Phone Number')}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label={t('location', 'Location')}
            value={location}
            onChange={e => setLocation(e.target.value)}
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
            {loading ? t('registering', 'Registering...') : t('register', 'Register')}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </Box>
    </Paper>
  );

// Prop types for type safety

RegisterForm.propTypes = {
  onRegister: PropTypes.func,
};
}
export default RegisterForm;
