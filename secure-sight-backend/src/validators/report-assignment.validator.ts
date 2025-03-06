import { isValid, parse } from "date-fns";
import yup from "../helper/yup.helper";

export const reportAssignmentValidationSchema = yup.object({
  index: yup.string().required(),
  date: yup.string().required().test('is-valid', '${path} is not valid date', (v, context) => {
    const p = parse(v, 'yyyy-MM-dd', new Date())
    return isValid(p)
  }),
  customerId: yup.string().required(),
  reporterId: yup.string().required()
})

export type ReportAssignmentValidationValues = yup.InferType<typeof reportAssignmentValidationSchema>