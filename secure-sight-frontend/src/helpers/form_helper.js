import { format, getYear, subDays } from "date-fns"

export const getWeeklyReportPayload = (values) => {
  const start_date = subDays(values.selectedDate, 7)
  const start_day = format(start_date, 'dd')
  const start_month = format(start_date, 'MMM').toLowerCase()

  const end_date = subDays(values.selectedDate, 1)
  const end_day = format(end_date, 'dd')
  const end_month = format(end_date, 'MMM').toLowerCase()

  const year = getYear(values.selectedDate)
  const tenant = values.tenant.toLowerCase()

  let payload = {
    index: `${start_month}_${start_day}_to_${end_month}_${end_day}_${year}_${tenant}_report`
  }
  return payload
}