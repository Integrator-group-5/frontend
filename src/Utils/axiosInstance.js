import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext, useMemo } from 'react';

const baseURL = import.meta.env.VITE_API_BASE_URL;
// 'http://localhost:8080'
const useAxios = () => {
  const { authTokens } = useContext(AuthContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${authTokens?.accessToken}` },
    });

    instance.interceptors.request.use((req) => {

      if (req.method.toUpperCase() === 'OPTIONS') {
        return req;
      }

      if (authTokens?.accessToken) {
        req.headers.Authorization = `Bearer ${authTokens.accessToken}`;
      } else {
        delete req.headers.Authorization;
      }

      return req;
    });

    return instance;
  }, [authTokens]);

  return axiosInstance;
};

export default useAxios;