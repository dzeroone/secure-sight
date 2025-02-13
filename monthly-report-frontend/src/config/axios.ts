import axios from "axios";
import Cookies from "universal-cookie";
import { BASE_URL } from "./constants";

const cookies = new Cookies();

const axiosApi = axios.create({
    baseURL: BASE_URL
});

const token = cookies.get("_token") || "";

axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default axiosApi;