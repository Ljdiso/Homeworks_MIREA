import axios from 'axios';

export const API_URL = 'http://localhost:8000'


const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token_cookie')}`
    return config
})

api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if ((error.response.status === 401 |
            (error.response.status === 422 && error.response.data.detail === 'Signature has expired'))
        && error.config && !error.config._isRetry
    ) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get(`${API_URL}/user/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.access_token)
            return api.request(originalRequest)
        } catch (e) {
            console.log(e)
        }
    }
    throw error
})



export default api