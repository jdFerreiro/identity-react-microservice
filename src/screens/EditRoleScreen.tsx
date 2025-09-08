import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, Checkbox, FormControlLabel, Button, Alert } from '@mui/material';

const EditRoleScreen: React.FC = () => {
  const { id } = useParams();
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get(`/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsActive(response.data.isActive);
    };
    fetchRole();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/roles/${id}`, { isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = `/roles/${id}`;
    } catch (err: any) {
      setError('Error al actualizar rol');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Editar Rol</Typography>
      <form onSubmit={handleSubmit}>
        <FormControlLabel
          control={<Checkbox checked={isActive} onChange={e => setIsActive(e.target.checked)} />}
          label="Activo"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default EditRoleScreen;
