import yup from '../helper/yup.helper'

export const customerCreateValidationSchema = yup.object({
  name: yup.string().required("Please enter customer name"),
  tCode: yup.string().required("Please enter tenant code"),
  tType: yup.string().optional(),
  msDate: yup.date().required('Monitoring start date is required'),
  meDate: yup.date().required('Monitoring end date is required'),
  emails: yup.object({
    to: yup.string().required("DL List (recipients) is required"),
    cc: yup.string().required("DL List (cc) is required"),
  }),
  apiConfig: yup.object({
    apex: yup.object({
      baseUrl: yup.string().url('APEX One base url should be a valid URL').required('APEX One base url is required'),
      appId: yup.string().required('APEX One application ID is required'),
      apiKey: yup.string().required('APEX One API key is required'),
    }),
    tmv: yup.object({
      baseUrl: yup.string().url().required('TM Vision One base url is required'),
      apiKey: yup.string().required('TM Vision One API key is required'),
    }),
    soar: yup.object({
      baseUrl: yup.string().url().required('SOAR base url is required'),
      apiKey: yup.string().required('SOAR API key is required'),
    }),
    cas: yup.object({
      baseUrl: yup.string().url().required('Cloud App Security base url is required'),
      apiKey: yup.string().required('Cloud App Security API key is required'),
    }),
    caw: yup.object({
      baseUrl: yup.string().url().required('Cloud App Workload base url is required'),
      apiKey: yup.string().required('Cloud App Workload API key is required'),
    }),
    ds: yup.object({
      baseUrl: yup.mixed().oneOfSchemas([
        yup.string().url('Deep Security base url is required'),
        yup.string().ipv4('Deep Security base ip is required')
      ]),
      apiKey: yup.string(),
    }),
  }),
  connectors: yup.array().of(yup.string().required()).min(1, "Minimum one connector should be selected").required()
})

export type CustomerCreateValidationValues = yup.InferType<typeof customerCreateValidationSchema>