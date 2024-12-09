import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {

  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() => {
    if (authTokens) {
      const decoded = decodeToken(authTokens.accessToken);
      return { email: decoded.sub, role: decoded.role };
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Reference to store the timeout ID
  const refreshTimeout = useRef(null);

  const loginUser = (tokens) => {
    setAuthTokens(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));

    const decoded = decodeToken(tokens.accessToken);
    if (decoded) {
      setUser({ email: decoded.sub, role: decoded.role });
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post(`${baseURL}/auth/logout`, {
        refreshToken: authTokens?.refreshToken,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');

    // Clear the scheduled token refresh
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${baseURL}/auth/token-refresh`, {
        refreshToken: authTokens.refreshToken,
      });
      const newTokens = response.data;
      loginUser(newTokens);
      return newTokens.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logoutUser();
      return null;
    }
  };

  useEffect(() => {
    if (authTokens) {
      const decoded = decodeToken(authTokens.accessToken);
      const expiresAt = decoded.exp * 1000;
      const timeout = expiresAt - Date.now() - 60000; // Refresh 1 minute before expiry

      if (timeout > 0) {
        refreshTimeout.current = setTimeout(() => {
          refreshToken();
        }, timeout);
      } else {
        refreshToken();
      }
    } else {
      // Clear any existing timeout
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    }
    setLoading(false);

    // Cleanup function
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Inline token decoder function
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default AuthContext;
