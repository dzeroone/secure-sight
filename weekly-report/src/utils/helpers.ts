import { REPORT_AUDIT_STATUS_LABEL, REPORT_STATUS_LABEL } from "../data/data"

export const gracefulStringWrap = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text

    let parts: string[] = []

    let startIndex = 0
    while (true) {
        let i = text.indexOf(" ", startIndex + maxLength)
        if (i === -1) {
            parts.push(text.substring(startIndex, text.length))
            return parts
        }
        parts.push(text.substring(startIndex, i))
        startIndex = i + 1
    }
}

export const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count > 1 ? suffix : ''}`;

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