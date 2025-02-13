import axiosApi from "@@/config/axios"

export const createMonthlyReport = async (data: any) => {
    try {
        const response = await axiosApi.post("/monthly/create", {
            ...data
        })
        return response.data;

    } catch (error) {
        throw error
    }
}

export const getMonthlyReportPdf = async (data: any) => {
    try {
        const response = await axiosApi.post("/pdf-download", {
            ...data
        }, {
            responseType: "arraybuffer"
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllMonthlyReports = async () => {
    try {
        const response = await axiosApi.get("/monthly/get")
        return response.data;
    } catch (error) {
        throw error;
    }
}