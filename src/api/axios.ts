import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + '/api',
    timeout: 30000, // Render-in oyanması üçün 30 saniyə
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        // Login və register kimi açıq marşrutlara token göndərmə
        const publicPaths = ['/login', '/register'];
        const isPublicPath = publicPaths.some(path => config.url?.endsWith(path));

        if (!isPublicPath) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Əgər backend 401 (Unauthorized) qaytarırsa, bu adətən tokenin keçərsiz olduğunu göstərir
        if (error.response?.status === 401) {
            console.error('Avtorizasiya xətası: Token səhvdir və ya sessiya bitib.');
            // İstəsən burada istifadəçini login səhifəsinə yönləndirə bilərsən
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        
        if (error.code === 'ECONNABORTED') {
            console.error('Sorğu vaxtı aşdı (Timeout).');
        }
        return Promise.reject(error);
    }
);

export default api;