import React, { useEffect, useState } from 'react';
import { getClients, deleteClient } from '../api/clientApi';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ClientList = ({ onEdit, refreshTrigger }) => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    const res = await getClients();
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    await deleteClient(id);
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
};

export default ClientList;
