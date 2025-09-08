import React, { useState } from 'react';
import api from '../services/api';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const CreateUserScreen: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/users', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/users';
    } catch (err: any) {
      setError('Error al crear usuario');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Crear Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="email" type="email" label="Email" value={form.email} onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="password" type="password" label="Contraseña" value={form.password} onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="firstName" type="text" label="Nombre" value={form.firstName} onChange={handleChange} fullWidth required margin="normal" />
        <TextField name="lastName" type="text" label="Apellido" value={form.lastName} onChange={handleChange} fullWidth required margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Crear
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default CreateUserScreen;
