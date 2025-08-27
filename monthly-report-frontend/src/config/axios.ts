import { loadAuthUser } from "@@/helper/helper";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SECURE_SIGHT_API_BASE || ''

const axiosApi = axios.create({
    baseURL: BASE_URL
});

axiosApi.interceptors.request.use(
    (config) => {
        let userInfo = loadAuthUser();
        if (userInfo) {
            if (userInfo.token) {
                config.headers.Authorization = `Bearer ${userInfo.token}`;
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