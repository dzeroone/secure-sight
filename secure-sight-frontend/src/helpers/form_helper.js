import { format, getYear, subDays } from "date-fns"

export const getWeeklyReportIndex = (date, tenantCode) => {
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

export const getMonthlyReportIndex = (date, tenantCode) => {
  const month = format(date, 'MMMM').toLowerCase()
  const year = getYear(date)
  const tenant = tenantCode.toLowerCase()

  return `${month}_${year}_${tenant}_report`
}