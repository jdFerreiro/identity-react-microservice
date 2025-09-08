import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, CircularProgress } from '@mui/material';

const UserDetailScreen: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    };
    fetchUser();
  }, [id]);

  if (!user) return <div>Cargando...</div>;
  if (!user) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Detalle de Usuario</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Nombre: {user.firstName}</Typography>
      <Typography>Apellido: {user.lastName}</Typography>
      <Typography>Activo: {user.isActive ? 'Sí' : 'No'}</Typography>
    </Box>
  );
};

export default UserDetailScreen;
