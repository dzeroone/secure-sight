import { format, getYear, subDays } from "date-fns"
import * as yup from 'yup'

function ipv4(message = 'Invalid IP address') {
  return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
    message,
    excludeEmptyString: true
  }).test('ip', message, value => {
    return value === undefined || value.trim() === ''
      ? true
      : value.split('.').find(i => parseInt(i, 10) > 255) === undefined;
  });
}

function oneOfSchemas(schemas) {
  return this.when(
    (values, schema, options) => schemas.find(one => one.isValidSync(options.value)) || schemas[0]
  );
}

yup.addMethod(yup.string, 'ipv4', ipv4);
yup.addMethod(yup.mixed, "oneOfSchemas", oneOfSchemas)

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