
// Component to display a list of clients in a table
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/clientApi';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ClientList = ({ onEdit, refreshTrigger }) => {
  // State for client list
  const [clients, setClients] = useState([]);

  // Fetch clients from API
  const fetchClients = async () => {
    const res = await api.getClients();
    setClients(res.data);
  };

  // Fetch clients when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  // Handle client deletion
  const handleDelete = async (id) => {
    await api.deleteClient(id);
    fetchClients();
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Client List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(client)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(client.id)}>
                  <DeleteIcon />
                </IconButton>
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
