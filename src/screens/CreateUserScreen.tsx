import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Box, TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';


interface CreateUserScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateUserScreen: React.FC<CreateUserScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  // Limpiar el formulario cada vez que se abre el modal
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
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      roleId: "",
    });
    setSuccess(false);
    // Fetch roles
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
    fetchRoles();
  }, []);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    roleId: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value) return "El correo electrónico es obligatorio";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Correo electrónico inválido";
        return "";
      case "password":
        if (!value) return "La contraseña es obligatoria";
        if (value.length < 6)
          return "La contraseña debe tener al menos 6 caracteres";
        return "";
      case "confirmPassword":
        if (!value) return "Debe confirmar la contraseña";
        if (value !== form.password) return "Las contraseñas no coinciden";
        return "";
      case "firstName":
        if (!value) return "El nombre es obligatorio";
        return "";
      case "lastName":
        if (!value) return "El apellido es obligatorio";
        return "";
      case "roleId":
        if (!value) return "Debe seleccionar un rol";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm({ ...form, [name as string]: value });
    const errorMsg = validateField(name as string, value as string);
    setErrors((prev) => ({ ...prev, [name as string]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.email) newErrors.email = "El correo electrónico es obligatorio";
    if (!form.password) newErrors.password = "La contraseña es obligatoria";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!form.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!form.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!form.roleId) newErrors.roleId = "Debe seleccionar un rol";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/users",
        {
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          roleId: form.roleId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        roleId: "",
      });
      setErrors({});
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err: any) {
      if (err?.response?.status === 400 && err?.response?.data?.message?.toLowerCase().includes('correo')) {
        setErrors({ general: 'El correo electrónico ya está registrado.' });
      } else if (err?.response?.data?.message) {
        setErrors({ general: `Error: ${err.response.data.message}` });
      } else {
        setErrors({
          general:
            "No se pudo crear el usuario. Verifique los datos e intente nuevamente.",
        });
      }
    }
  };

  return (
    <Box
      width="100%"
      maxWidth={500}
      mx="auto"
      mt={4}
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="#fff"
      sx={{ overflowX: "hidden" }}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          name="password"
          type="password"
          label="Contraseña"
          value={form.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          name="confirmPassword"
          type="password"
          label="Confirmar Contraseña"
          value={form.confirmPassword}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <TextField
          name="firstName"
          type="text"
          label="Nombre"
          value={form.firstName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          autoComplete="off"
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          name="lastName"
          type="text"
          label="Apellido"
          value={form.lastName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          autoComplete="off"
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <FormControl fullWidth margin="normal" error={!!errors.roleId}>
          <InputLabel id="role-label">Rol</InputLabel>
          <Select
            labelId="role-label"
            name="roleId"
            value={form.roleId}
            label="Rol"
            onChange={handleSelectChange}
            sx={errors.roleId === "" && form.roleId ? { borderColor: "green" } : {}}
          >
            <MenuItem value=""><em>Seleccione un rol</em></MenuItem>
            {roles.map(role => (
              <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
            ))}
          </Select>
          {errors.roleId && <Box color="error.main" fontSize={12} mt={0.5}>{errors.roleId}</Box>}
        </FormControl>
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
      {/* Mostrar error general al final */}
      {errors.general && (
        <Alert severity="error" sx={{ mt: 2 }}>{errors.general}</Alert>
      )}
      {/* Dialogo de confirmación para cancelar */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Desea cerrar el formulario?</DialogTitle>
        <DialogContent>Se perderán los datos ingresados.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              if (onCancel) onCancel();
            }}
            color="error"
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Usuario creado correctamente
        </Alert>
      )}
    </Box>
  );
};

export default CreateUserScreen;
