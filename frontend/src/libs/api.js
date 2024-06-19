import axios from 'axios';

export const baseURL = process.env.apiBaseUrl;

export const apiClient = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    // Verifica se os dados enviados são uma instância de FormData
    if (config.data instanceof FormData) {
        // Remove o cabeçalho Content-Type para permitir que o navegador o defina
        delete config.headers['Content-Type'];
    }

    return config;
});


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            // localStorage.removeItem('token');
            // window.location.pathname = '/auth';
        }
        return Promise.reject(error);
    }
);