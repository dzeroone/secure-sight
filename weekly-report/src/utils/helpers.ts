import { format } from "date-fns"
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

export const extractInfoFromIndex = (index: string) => {
	const splited = index.split('_')
	const tCode = splited[splited.length - 2]
	const rType = index.includes('_to_') ? 'weekly' : 'monthly'
	let date = ''
	if (rType == 'weekly') {
		const parts = index.match(/(\D+)_(\d+)_to_(\D+)_(\d+)_(\d+)/i)
		if (parts) {
			const end_date = new Date(`${parts[5]}-${parts[3]}-${parts[4]}`)
			const report_date = new Date(end_date).setDate(end_date.getDate() + 1)
			date = format(report_date, 'yyyy-MM-dd')
		}
	} else {
		const parts = index.match(/(\D+)_(\d+)/i)
		if (parts) {
			const report_date = new Date(`${parts[2]}-1-${parts[1]}`)
			date = format(report_date, 'yyyy-MM-dd')
		}
	}
	return {
		date,
		tCode,
		rType
	}
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