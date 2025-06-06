import axios from 'axios';

const API_URL = 'https://alezoo-back.vercel.app/api';

class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: false // Changed to false for Vercel deployment
        }
      );
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Limpiar headers de axios
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  setAuthToken(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }
};

export default authService;
