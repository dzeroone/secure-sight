import { format, getYear, subDays } from "date-fns"

export const getWeeklyReportIndex = (date, tenantCode) => {
  const start_date = subDays(date, 7)
  const start_day = format(start_date, 'd')
  const start_month = format(start_date, 'MMM').toLowerCase()

  const end_date = subDays(date, 1)
  const end_day = format(end_date, 'd')
  const end_month = format(end_date, 'MMM').toLowerCase()

  const year = getYear(date)
  const tenant = tenantCode.toLowerCase()

  return `${start_month}_${start_day}_to_${end_month}_${end_day}_${year}_${tenant}_report`
}

export const getMonthlyReportIndex = (date, tenantCode) => {
  const month = format(date, 'MMMM').toLowerCase()
  const year = getYear(date)
  const tenant = tenantCode.toLowerCase()

  return `${month}_${year}_${tenant}_report`
}

export const formatMonthlyReportSession = (date) => {
  return format(date, 'PP')
}

export const formatWeeklyReportSession = (date) => {
  const start_date = subDays(date, 7)
  const end_date = subDays(date, 1)

  return `${format(start_date, 'PP')} - ${format(end_date, 'PP')}`
}

export const extractInfoFromIndex = (index) => {
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