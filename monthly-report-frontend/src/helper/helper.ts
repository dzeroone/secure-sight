import { REPORT_AUDIT_STATUS_LABEL, REPORT_STATUS_LABEL } from "@@/constants";
import { format } from "date-fns/format";

export function updateNestedField(obj: any, path: string, value: any): any {
    const keys = path.split(".");
    let newObj = { ...obj }; // Start with a shallow copy of the input object
    let current = newObj;

    // Iterate over the keys, but stop at the second-to-last key
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the current level does not have the key, create an empty object
        if (!(key in current)) {
            current[key] = {};
        }
        // Move deeper into the object, creating shallow copies as needed
        current[key] = { ...current[key] };
        current = current[key];
    }

    // Update the final key with the new value
    current[keys[keys.length - 1]] = value;

    return newObj;
}

export const getErrorMessage = (error: any) => {
    if (error?.response?.data?.message) {
        return error.response.data.message
    }
    return error.message
}

export const getReportStatusTitle = (statusCode: number) => {
    return REPORT_STATUS_LABEL['' + statusCode] || ""
}

export const getReportAuditStatusTitle = (statusCode: number) => {
    return REPORT_AUDIT_STATUS_LABEL['' + statusCode] || ""
}

export const formatMonthlyReportSession = (date: string) => {
    return format(date, 'MMMM, yyyy')
}