import axiosApi from "@@/config/axios";

export const doLogin = async (email: string, password: string) => {
    try {
        const response = await axiosApi.post("/auth/login", {
            email, password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}