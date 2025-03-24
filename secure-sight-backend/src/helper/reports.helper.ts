import { format, getYear, subDays } from "date-fns"
import { ReportType } from "../controllers/assignment.controller"

export const jsonFlattenObject = function (data: any) {
	var result: any = {}
	function recurse(cur: any, prop: any) {
		if (Object(cur) !== cur) {
			result[prop] = cur
		} else if (Array.isArray(cur)) {
			for (var i = 0, l = cur.length; i < l; i++)
				recurse(cur[i], prop + '[' + i + ']')
			if (l == 0) result[prop] = []
		} else {
			var isEmpty = true
			for (var p in cur) {
				isEmpty = false
				recurse(cur[p], prop ? prop + '.' + p : p)
			}
			if (isEmpty && prop) result[prop] = {}
		}
	}
	recurse(data, '')
	return result
}

export const getMontlyReportIndex = (date: string, tenantCode: string) => {
	const month = format(date, 'MMMM').toLowerCase()
	const year = getYear(date)
	const tenant = tenantCode.toLowerCase()

	return `${month}_${year}_${tenant}_report`
}

export const getWeeklyReportIndex = (date: string, tenantCode: string) => {
	const start_date = subDays(date, 7)
	const start_day = format(start_date, 'dd')
	const start_month = format(start_date, 'MMM').toLowerCase()

	const end_date = subDays(date, 1)
	const end_day = format(end_date, 'dd')
	const end_month = format(end_date, 'MMM').toLowerCase()

	const year = getYear(date)
	const tenant = tenantCode.toLowerCase()

	return `${start_month}_${start_day}_to_${end_month}_${end_day}_${year}_${tenant}_report`
}

const formatMonthlyReportDate = (date: string) => {
	return format(date, 'PP')
}

const formatWeeklyReportDate = (date: string) => {
	const start_date = subDays(date, 7)
	const end_date = subDays(date, 1)

	return `${format(start_date, 'PP')} - ${format(end_date, 'PP')}`
}

export const formatReportSession = (rt: ReportType, date: string) => {
	if (rt == 'monthly') {
		return formatMonthlyReportDate(date)
	}
	return formatWeeklyReportDate(date)
}