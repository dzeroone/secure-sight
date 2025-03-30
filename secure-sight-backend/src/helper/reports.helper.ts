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