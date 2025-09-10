import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const RolesListScreen: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  useEffect(() => {
    // Token expiration check
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      try {
        await api.get('/roles', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    };
    checkToken();
    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get('/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', flex: 2 },
    { field: 'isActive', headerName: 'Estado', flex: 1, renderCell: (params) => params.value ? 'Activo' : 'Inactivo' },
  ];

  return (
    <Box width="100vw" minHeight="100vh" bgcolor="#f5f5f5" p={3} display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth={600} mb={3}>
        <Typography variant="h4">Mantenimiento de Roles</Typography>
      </Box>
      <DataGrid
        rows={roles}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        sx={{
          width: '100%',
          maxWidth: 600,
          background: '#fff',
          '& .MuiDataGrid-columnHeader': {
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          },
        }}
      />
    </Box>
  );
};

export default RolesListScreen;
