import React, { useEffect, useState } from 'react';
import { getClients, deleteClient } from '../api/clientApi';

const ClientList = ({ onEdit }) => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    const res = await getClients();
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    await deleteClient(id);
    fetchClients();
  };

  return (
    <div>
      <h2>Client List</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>
                <button onClick={() => onEdit(client)}>Edit</button>
                <button onClick={() => handleDelete(client.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
