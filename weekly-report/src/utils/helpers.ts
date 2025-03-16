import { REPORT_AUDIT_STATUS_LABEL, REPORT_STATUS_LABEL } from "../data/data"

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