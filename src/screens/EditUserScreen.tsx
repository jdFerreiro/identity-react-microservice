import React, { useEffect, useState } from 'react';
// Eliminado import no usado
import api from '../services/api';
import { Box, Typography, Checkbox, FormControlLabel, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface EditUserScreenProps {
  id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  setProcessing?: (value: boolean) => void;
}

const EditUserScreen: React.FC<EditUserScreenProps> = ({ id, onSuccess, onCancel, setProcessing }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '', confirmPassword: '', isActive: false, roleId: '' });
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({
        email: response.data.email || '',
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        password: '',
        confirmPassword: '',
        isActive: response.data.isActive || false,
        roleId: response.data.role?.id || '',
      });
    };
    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/roles', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoles(response.data);
      } catch (err) {
        setRoles([]);
      }
    };
    fetchUser();
    fetchRoles();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!form.lastName) {
      setError('El apellido es obligatorio');
      return;
    }
    if (!form.roleId) {
      setError('Debe seleccionar un rol');
      return;
    }
    if (form.password && !form.confirmPassword) {
      setError('Debe confirmar la nueva contraseña');
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
  if (typeof setProcessing === 'function') setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const payload: any = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        isActive: form.isActive,
        roleId: form.roleId,
      };
      if (form.password) {
        payload.password = form.password;
      }
      await api.patch(`/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setError('');
      setTimeout(() => {
  setSuccess(false);
  if (typeof setProcessing === 'function') setProcessing(false);
  if (onSuccess) onSuccess();
      }, 1200);
    } catch (err: any) {
      if (typeof setProcessing === 'function') setProcessing(false);
      if (err?.response?.data?.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError('No se pudo actualizar el usuario. Verifique los datos e intente nuevamente.');
      }
    }
  };

    return (
      <Box width="100%" maxWidth={500} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff" sx={{ overflowX: 'hidden' }}>
        <Typography variant="h5" mb={2}>Editar Usuario</Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box mb={2}>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              placeholder="Email"
              style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#f5f5f5' }}
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Contraseña (dejar vacío para no cambiar)"
              style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirmar Contraseña"
              style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              placeholder="Nombre"
              style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              placeholder="Apellido"
              style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                name="roleId"
                value={form.roleId}
                label="Rol"
                onChange={e => setForm({ ...form, roleId: e.target.value })}
                sx={error === '' && form.roleId ? { borderColor: 'green' } : {}}
              >
                <MenuItem value=""><em>Seleccione un rol</em></MenuItem>
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <FormControlLabel
            control={<Checkbox checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />}
            label="Activo"
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="medium"
              startIcon={<SaveIcon />}
              sx={{ minWidth: 120 }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmOpen(true)}
              size="medium"
              startIcon={<CancelIcon />}
              sx={{ minWidth: 120 }}
            >
              Cancelar
            </Button>
          </Box>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Usuario actualizado correctamente</Alert>}

        {/* Dialogo de confirmación para cancelar */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>¿Desea cerrar el formulario?</DialogTitle>
          <DialogContent>Se perderán los cambios realizados.</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">No</Button>
            <Button onClick={() => { setConfirmOpen(false); if (onCancel) onCancel(); }} color="error">Sí</Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}
export default EditUserScreen;