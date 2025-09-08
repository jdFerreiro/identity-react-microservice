import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const AssignRoleScreen: React.FC = () => {
  const { id } = useParams();
  const [roleId, setRoleId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post(`/users/${id}/role`, { roleId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = `/users/${id}`;
    } catch (err: any) {
      setError('Error al asignar rol');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Asignar Rol a Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <TextField type="text" label="ID del Rol" value={roleId} onChange={e => setRoleId(e.target.value)} fullWidth required margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Asignar
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AssignRoleScreen;
