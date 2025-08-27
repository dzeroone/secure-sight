import { loadAuthUser } from "@/lib/utils";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_SECURE_SITE_API_BASE || ''

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

export default axiosApi;