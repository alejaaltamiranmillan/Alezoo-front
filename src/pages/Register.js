import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import LoadingScreen from '../components/LoadingScreen';
import authService from '../services/authService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 500,
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

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const steps = ['Datos personales', 'Credenciales'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      showNotification('¡Registro exitoso! Por favor inicia sesión', 'success');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error en el registro';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre completo"
              variant="outlined"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              fullWidth
              label="Confirmar contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Box>
        );
      default:
        return null;
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
        <StyledPaper elevation={3}>
          <Box sx={{ textAlign: 'center' }}>
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
              Crear cuenta
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Únete a nuestra comunidad de cuidado animal
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ borderRadius: '20px' }}
              >
                Atrás
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  borderRadius: '20px',
                  px: 4,
                }}
              >
                {activeStep === steps.length - 1 ? 'Registrarse' : 'Siguiente'}
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" style={{ color: '#4f9d69', textDecoration: 'none' }}>
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </AnimatedBox>
    </>
  );
}

export default Register;
