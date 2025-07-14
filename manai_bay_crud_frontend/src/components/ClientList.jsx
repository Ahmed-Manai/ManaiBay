
// Component to display a list of clients in a table
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ClientList = ({ onEdit, refreshTrigger }) => {
  // State for client list and error
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');

  // Fetch clients from API with error handling
  const fetchClients = async () => {
    setError('');
    try {
      const res = await api.get('/users/');
      setClients(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail));
      } else {
        setError('Failed to fetch users. Please check your authentication or try again.');
      }
      setClients([]);
    }
  };

  // Fetch clients when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  // Handle client deletion
  const handleDelete = async (id) => {
    await api.deleteUser(id);
    fetchClients();
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ m: 2 }}>
        User List
      </Typography>
      {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Updated Date</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.created_date}</TableCell>
              <TableCell>{user.updated_date}</TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => onEdit(user)}><EditIcon /></IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

// Prop types for type safety
ClientList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};
};

export default ClientList;
