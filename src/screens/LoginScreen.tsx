import React, { useState } from "react";
import api from "../services/api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Respuesta del servidor:", response.data);
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        window.location.href = "/users";
      } else {
        setError("Respuesta inesperada del servidor");
        console.error("Respuesta inesperada:", response.data);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        console.error("Error de login:", err.response.data);
      } else {
        setError("Error de conexión o credenciales inválidas");
        console.error("Error desconocido:", err);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100vw"
      bgcolor="#f5f5f5"
    >
      {processing && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <CircularProgress size={70} color="primary" thickness={5} />
        </Box>
      )}
      <Box width={350} p={4} boxShadow={3} borderRadius={2} bgcolor="#fff">
        <Typography variant="h5" mb={2} align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              sx={{ mt: 2, minWidth: 120 }}
              startIcon={<LoginIcon />}
            >
              Ingresar
            </Button>
          </Box>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default LoginScreen;
