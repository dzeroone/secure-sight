import axios from "axios";

const BASE_URL = process.env.REACT_APP_SECURE_SITE_API_BASE || ''

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

export default axiosApi;