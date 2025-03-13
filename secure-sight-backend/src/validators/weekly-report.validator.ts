import yup from "../helper/yup.helper";

export const weeklyReportValidationSchema = yup.object({
  index: yup.string().required(),
  formData: yup.mixed().required(),
  reportData: yup.mixed().required(),
  comment: yup.string().optional(),
  status: yup.number().required()
})

export type WeeklyReportValidationValues = yup.InferType<typeof weeklyReportValidationSchema>

export const weeklyReportEditValidationSchema = yup.object({
  index: yup.string().optional(),
  formData: yup.mixed().required(),
  reportData: yup.mixed().required(),
  comment: yup.string().optional(),
  status: yup.number().required()
})

export type WeeklyReportEditValidationValues = yup.InferType<typeof weeklyReportEditValidationSchema>