import yup from "../helper/yup.helper";

export const monthlyReportValidationSchema = yup.object({
  index: yup.string().required(),
  report: yup.mixed().required(),
  comment: yup.string().optional()
})

export type MonthlyReportValidationValues = yup.InferType<typeof monthlyReportValidationSchema>

export const monthlyReportEditValidationSchema = yup.object({
  index: yup.string().optional(),
  report: yup.mixed().required(),
  comment: yup.string().optional()
})

export type MonthlyReportEditValidationValues = yup.InferType<typeof monthlyReportValidationSchema>