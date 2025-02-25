import { format, getYear, subDays } from "date-fns"

export const getWeeklyReportPayload = (values) => {
  const month = format(values.selectedDate, 'MMMM').toLowerCase()
  const start_day = subDays(values.selectedDate, 7).getDate()
  const end_day = subDays(values.selectedDate, 1).getDate()
  const year = getYear(values.selectedDate)
  const tenant = values.tenant.toLowerCase()

  let payload = {
    index: `${month}_${start_day}_to_${end_day}_${year}_${tenant}_report`
  }
  return payload
}