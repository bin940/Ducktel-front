import axios from 'axios';

const api = axios.create({
    baseURL: 'https://www.ducktel.uk/api',
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post('/api/auth/refresh', null, {
                    withCredentials: true,
                });

                const newAccessToken = res.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (e) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
