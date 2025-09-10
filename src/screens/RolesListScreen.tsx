import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

const RolesListScreen: React.FC = () => {
  // Estado global para spinner de pantalla completa
  const [processing, setProcessing] = useState(false);
  // ...existing code...
  const [roles, setRoles] = useState<any[]>([]);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleNameError, setRoleNameError] = useState('');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [roleActive, setRoleActive] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Overlay spinner para procesos
  // El spinner global depende de processing

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
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" width="100%">
          <Tooltip title="Editar">
            <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleAdd = () => {
  setDialogMode('create');
  setRoleName('');
  setRoleActive(true);
  setOpenDialog(true);
  };

  const handleEdit = (role: any) => {
  console.log('Editando rol, id:', role.id);
  setDialogMode('edit');
  setEditRoleId(role.id);
  setRoleName(role.name);
  setRoleActive(role.isActive);
  setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
  setDeleteRoleId(id);
  setOpenDeleteDialog(true);
  };

  const handleDialogClose = () => {
    if (roleName) {
      setConfirmCancelOpen(true);
    } else {
      setOpenDialog(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmCancelOpen(false);
    setOpenDialog(false);
    setRoleName('');
    setRoleNameError('');
    setFormError('');
    setFormSuccess('');
  };

  const handleCancelReject = () => {
    setConfirmCancelOpen(false);
  };

  const handleDeleteDialogClose = () => {
  setOpenDeleteDialog(false);
  setDeleteRoleId(null);
  };

  const handleDialogSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRoleNameError('');
    setFormError('');
    if (!roleName.trim()) {
      setRoleNameError('El nombre es obligatorio');
      return;
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (dialogMode === 'create') {
        await api.post('/roles', { name: roleName.trim(), isActive: true }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormSuccess('Rol creado correctamente');
      } else if (editRoleId) {
        await api.patch(`/roles/${editRoleId}`, { name: roleName.trim(), isActive: roleActive }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormSuccess('Rol actualizado correctamente');
      }
      // Actualizar lista de roles
      const response = await api.get('/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
      // Esperar un poco para mostrar el mensaje y el spinner
      await new Promise(resolve => setTimeout(resolve, 1200));
      setOpenDialog(false);
      setFormSuccess('');
      setRoleName('');
      setRoleNameError('');
      setFormError('');
      setEditRoleId(null);
    } catch (err: any) {
      setFormError('No se pudo guardar el rol. Intente nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRoleId) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/roles/${deleteRoleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualizar lista de roles
      const response = await api.get('/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    } catch (err) {
      // Puedes agregar manejo de error aquí si lo deseas
    } finally {
      setProcessing(false);
      setOpenDeleteDialog(false);
      setDeleteRoleId(null);
    }
  };

  return (
    <Box width="100vw" height="100vh" bgcolor="#f5f5f5" p={3} display="flex" flexDirection="column" alignItems="center" sx={{ boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      {processing && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
        >
          <CircularProgress size={70} color="primary" thickness={5} />
        </Box>
      )}
      <Box width="100%" maxWidth={1000} mx="auto" mb={3} display="flex" justifyContent="space-between" alignItems="center" sx={{ boxSizing: 'border-box' }}>
        <Typography variant="h4">Mantenimiento de Roles</Typography>
        <Tooltip title="Agregar">
          <IconButton color="primary" onClick={handleAdd} size="large">
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box width="100%" maxWidth={1000} mx="auto" flex={1} sx={{ boxSizing: 'border-box', overflow: 'auto', height: 'calc(100vh - 120px)' }}>
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
            minHeight: '60vh',
            maxHeight: '100%',
            background: '#fff',
            maxWidth: 1000,
            margin: '0 auto',
            boxSizing: 'border-box',
            overflow: 'auto',
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

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={(_unused, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleDialogClose();
        }}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
        sx={{
          '& .MuiDialog-paper': {
            width: '50vw',
            height: '80vh',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', mb: 1 }}>{dialogMode === 'create' ? 'Agregar Rol' : 'Editar Rol'}</DialogTitle>
        <DialogContent sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
          <Box
            width="100%"
            maxWidth="500px"
            margin="0 auto"
            bgcolor="#fff"
            boxShadow={3}
            borderRadius={2}
            sx={{ border: '1px solid #e0e0e0', p: 3, boxSizing: 'border-box', overflowX: 'hidden' }}
          >
            <Box component="form" autoComplete="off" sx={{ width: '100%' }} onSubmit={handleDialogSubmit}>
              <TextField
                label="Nombre"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                fullWidth
                margin="normal"
                error={!!roleNameError}
                helperText={roleNameError}
              />
              {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
              {formSuccess && <Alert severity="success" sx={{ mt: 2 }}>{formSuccess}</Alert>}
              <Box display="flex" gap={2} mt={2}>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleDialogClose}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={processing}
                >
                  {dialogMode === 'create' ? 'Agregar' : 'Guardar'}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        {/* Dialogo de confirmación para cancelar */}
        <Dialog open={confirmCancelOpen} onClose={handleCancelReject}>
          <DialogTitle>¿Desea cerrar el formulario?</DialogTitle>
          <DialogContent>Se perderán los datos ingresados.</DialogContent>
          <DialogActions>
            <Button onClick={handleCancelReject} color="primary">No</Button>
            <Button onClick={handleCancelConfirm} color="error">Sí</Button>
          </DialogActions>
        </Dialog>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', mb: 1 }}>¿Eliminar rol?</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro que desea eliminar este rol?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} variant="outlined" color="secondary" disabled={processing}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={processing}>
            Eliminar
          </Button>
        </DialogActions>
  </Dialog>
    </Box>
  );
};

export default RolesListScreen;