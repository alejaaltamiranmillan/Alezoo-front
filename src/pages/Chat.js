import { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PetsIcon from '@mui/icons-material/Pets';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '90vh',
  margin: '20px',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
}));

const MessageBubble = styled(motion.div)(({ theme, $isAI }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: $isAI ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
  backgroundColor: $isAI ? theme.palette.primary.light : theme.palette.secondary.light,
  color: '#fff',
  margin: '8px',
  alignSelf: $isAI ? 'flex-start' : 'flex-end',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = 'https://alezoo-back.vercel.app/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/chat/history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessages(response.data.map(msg => ({
          content: msg.content,
          isAI: msg.sender === 'ai',
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [navigate]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userMessage = {
      content: input,
      isAI: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/message`, 
        { message: input },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.message) {
        const aiMessage = {
          content: response.data.message,
          isAI: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: 2 }}>
      <ChatContainer elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PetsIcon />
          </Avatar>
          <Typography variant="h6">Alejandra - Veterinaria Virtual</Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              $isAI={msg.isAI}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleString()}
              </Typography>
              <Typography>{msg.content}</Typography>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe tu mensaje aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                backgroundColor: 'white'
              }
            }}
          />
          <IconButton 
            onClick={handleSend}
            disabled={loading}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark'
              },
              '&:disabled': {
                backgroundColor: 'grey.400'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </ChatContainer>
    </Box>
  );
}

export default Chat;
