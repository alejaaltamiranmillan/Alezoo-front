import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  borderRadius: 20,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const AnimatedBox = styled(motion(Box))({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #88d1a3 0%, #4f9d69 100%)',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
});

const BubbleAnimation = styled(motion.div)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
});

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showNotification('¡Bienvenido de nuevo!', 'success');
      navigate('/chat');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <AnimatedBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Burbujas decorativas */}
        {[...Array(5)].map((_, i) => (
          <BubbleAnimation
            key={i}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <StyledPaper elevation={3}>
          <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <IconButton
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 60,
                  height: 60,
                  mb: 2,
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <PetsIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </motion.div>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              ¡Bienvenido!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Consulta con Alejandra, tu veterinaria virtual
            </Typography>

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                borderRadius: '30px',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Iniciar Sesión
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" style={{ color: '#4f9d69', textDecoration: 'none' }}>
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </AnimatedBox>
    </>
  );
}

export default Login;
