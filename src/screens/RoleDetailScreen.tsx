import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, CircularProgress } from '@mui/material';

const RoleDetailScreen: React.FC = () => {
  const { id } = useParams();
  const [role, setRole] = useState<any>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get(`/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRole(response.data);
    };
    fetchRole();
  }, [id]);

  if (!role) return <div>Cargando...</div>;
  if (!role) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Detalle de Rol</Typography>
      <Typography>Nombre: {role.name}</Typography>
      <Typography>Activo: {role.isActive ? 'Sí' : 'No'}</Typography>
    </Box>
  );
};

export default RoleDetailScreen;
