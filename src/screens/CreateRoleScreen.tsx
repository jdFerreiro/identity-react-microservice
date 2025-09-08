import React, { useState } from 'react';
import api from '../services/api';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const CreateRoleScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/roles', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/roles';
    } catch (err: any) {
      setError('Error al crear rol');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Crear Rol</Typography>
      <form onSubmit={handleSubmit}>
        <TextField type="text" label="Nombre del rol" value={name} onChange={e => setName(e.target.value)} fullWidth required margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Crear
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default CreateRoleScreen;
