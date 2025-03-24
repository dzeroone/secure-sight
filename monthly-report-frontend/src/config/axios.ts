import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SECURE_SIGHT_API_BASE || ''

const axiosApi = axios.create({
    baseURL: BASE_URL
});

axiosApi.interceptors.request.use(
    (config) => {
        let userInfo = localStorage.getItem("authUser");
        if (userInfo) {
            const parsed = JSON.parse(userInfo)
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
        return config;
    }
)

axiosApi.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.status == 401) {
            location.href = "/"
            return
        }
        return Promise.reject(error)
    },
)

export default axiosApi;