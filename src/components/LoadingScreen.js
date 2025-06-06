import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import PetsIcon from '@mui/icons-material/Pets';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress 
            size={80} 
            sx={{ color: 'primary.main' }}
          />
          <PetsIcon 
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'primary.main',
              fontSize: 40
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;
