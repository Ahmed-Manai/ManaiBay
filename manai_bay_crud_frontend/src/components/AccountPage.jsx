import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Grid, CircularProgress, Alert, CssBaseline } from '@mui/material';
import clientApi from '../api/clientApi';
import Header from './ecommerce/Header';

const AccountPage = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });
  const [password, setPassword] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await clientApi.getClient(window.localStorage.getItem('user_id'));
        setUser(res.data);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchUser();
  }, []);

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await clientApi.updateClient(user.id, user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.new_password !== password.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // This is a placeholder for the actual API call
      // await accountApi.updatePassword(password);
      setSuccess('Password updated successfully');
      setPassword({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      setError('Failed to update password');
    }
    setLoading(false);
  };

  return (
    <>
      <CssBaseline />
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <form onSubmit={handleUserSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={user.first_name}
                onChange={handleUserChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={user.last_name}
                onChange={handleUserChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={user.phone_number}
                onChange={handleUserChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={user.address}
                onChange={handleUserChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Update Password
        </Typography>
        <form onSubmit={handlePasswordSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="current_password"
                value={password.current_password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="new_password"
                value={password.new_password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirm_password"
                value={password.confirm_password}
                onChange={handlePasswordChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Update Password'}
            </Button>
          </Box>
        </form>
      </Paper>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Container>
    </>
  );
};

export default AccountPage;