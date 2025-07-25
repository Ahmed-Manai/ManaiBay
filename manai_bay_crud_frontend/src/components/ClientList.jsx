
// Component to display a list of clients in a table
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Alert, Box } from '@mui/material';
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
    <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', ml: '-50vw', mr: '-50vw', overflowX: 'auto', mb: 10, p: 4, bgcolor: 'background.default' }}>
        <TableContainer component={Paper} sx={{ width: '97vw', minWidth: 320, mx: 'auto', borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ m: 2 }}>
          User List
        </Typography>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
        <Table
          sx={{
            minWidth: 650,
            background: 'linear-gradient(90deg, #e3f2fd 0%, #f5f7fa 100%)',
            '& thead th': {
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
              borderBottom: '2px solid #1565c0',
            },
            '& tbody td': {
              fontSize: 15,
              borderBottom: '1px solid #e0e0e0',
            },
            '& tbody tr:hover': {
              background: 'linear-gradient(90deg, #bbdefb 0%, #90caf9 100%)',
              boxShadow: '0 4px 24px 0 rgba(25, 118, 210, 0.10)',
              transition: 'background 0.2s, box-shadow 0.2s',
            },
          }}
          size="small"
          aria-label="client table"
        >
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
                <TableCell sx={{ wordBreak: 'break-all' }}>{user.email}</TableCell>
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
    </Box>
  );

// Prop types for type safety
ClientList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};
};

export default ClientList;
