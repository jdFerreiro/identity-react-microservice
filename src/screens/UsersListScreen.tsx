import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Stack from "@mui/material/Stack";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CreateUserScreen from './CreateUserScreen';
import EditUserScreen from './EditUserScreen';

const UsersListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id: string) => {
    setEditUserId(id);
    setOpenEdit(true);
  };
  const handleBlock = (id: string) => {
    setUserToDelete(id);
    setConfirmDeleteOpen(true);
  };
  const confirmBlockUser = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem("token");
    await api.patch(`/users/${userToDelete}`, { isActive: false }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.map(u => u.id === userToDelete ? { ...u, isActive: false } : u));
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };
  const handleUnblock = async (id: string) => {
    const token = localStorage.getItem("token");
    await api.patch(`/users/${id}`, { isActive: true }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.map(u => u.id === id ? { ...u, isActive: true } : u));
  };
  const handleCreate = () => setOpenCreate(true);

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'firstName', headerName: 'Nombre', flex: 2 },
    { field: 'lastName', headerName: 'Apellido', flex: 2 },
    { field: 'role', headerName: 'Rol', flex: 1, renderCell: (params: any) => params.row?.role?.name || '' },
    { field: 'isActive', headerName: 'Estado', flex: 0.5, renderCell: (params) => params.value ? 'Activo' : 'Bloqueado' },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          {params.row.isActive ? (
            <Tooltip title="Bloquear">
              <IconButton color="error" onClick={() => handleBlock(params.row.id)}>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Desbloquear">
              <IconButton color="success" onClick={() => handleUnblock(params.row.id)}>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box width="100vw" minHeight="100vh" bgcolor="#f5f5f5" p={3} display="flex" flexDirection="column" alignItems="center">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} width="100%" maxWidth={1200}>
        <Stack direction="column">
          <Typography variant="h4">Mantenimiento de Usuarios</Typography>
        </Stack>
        <Stack direction="column">
          <Tooltip title="Crear Usuario">
            <IconButton color="primary" onClick={handleCreate}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Dialog para crear usuario */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '50vw',
            height: '80vh',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }}
      >
        <DialogTitle>Crear Usuario</DialogTitle>
        <DialogContent sx={{ width: '90%', height: '100%' }}>
          <CreateUserScreen onSuccess={() => { setOpenCreate(false); fetchUsers(); }} onCancel={() => setOpenCreate(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar usuario */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '50vw',
            height: '80vh',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }}
      >
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent sx={{ width: '90%', height: '100%' }}>
          {editUserId && <EditUserScreen id={editUserId} onSuccess={() => { setOpenEdit(false); fetchUsers(); }} onCancel={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      <DataGrid
        rows={users}
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
          maxWidth: 1200,
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

      {/* Dialogo de confirmación para bloquear usuario */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>¿Desea bloquear este usuario?</DialogTitle>
        <DialogContent>El usuario no podrá iniciar sesión hasta que sea desbloqueado.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">No</Button>
          <Button onClick={confirmBlockUser} color="error">Sí</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersListScreen;