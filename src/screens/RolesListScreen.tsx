import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const RolesListScreen: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get('/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Roles</Typography>
      <List>
        {roles.map(role => (
          <ListItem key={role.id}>
            <ListItemText primary={role.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RolesListScreen;
