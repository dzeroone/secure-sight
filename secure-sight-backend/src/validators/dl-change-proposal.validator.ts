import yup from "../helper/yup.helper";

export const dlChangeValidationSchema = yup.object({
  emails: yup.object({
    to: yup.string().required("DL List (recipients) is required"),
    cc: yup.string().required("DL List (cc) is required"),
  }),
})

export type DLChangeValidationValues = yup.InferType<typeof dlChangeValidationSchema>