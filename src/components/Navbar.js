import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';

const Navbar = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth) return null; // Prevenir renderizado si auth no está disponible
  const { user, logout } = auth;

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmLogout = () => {
    setOpenDialog(false);
    if (logout) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #4f9d69 30%, #88d1a3 90%)' }}>
        <Toolbar>
          <PetsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Alezoo
          </Typography>
          {user && (
            <>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                {user.name?.[0]?.toUpperCase()}
              </Avatar>
              <Button color="inherit" onClick={handleLogoutClick}>
                Cerrar Sesión
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas cerrar sesión?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmLogout} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
