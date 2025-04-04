import yup from "../helper/yup.helper"

export const commonDataValidationSchema = yup.object({
  tg_cyber_cri: yup.array().of(yup.object({ // Top Global Cyber Criminals
    title: yup.string(),
    desc: yup.string()
  })),
  tg_vul: yup.array().of(yup.object({ // Top Global Vulnerabilities
    title: yup.string(),
    desc: yup.string()
  })),
  tg_mal: yup.array().of(yup.object({ // Top Global Malware
    title: yup.string(),
    desc: yup.string()
  })),
  tg_mitre: yup.array().of(yup.object({ // Top Global MITRE ATT&CK Techniques
    title: yup.string(),
    desc: yup.string()
  })),
  threat_intel_summary: yup.object({
    advisory_chart: yup.object({
      ioc: yup.number().default(0),
      advisories: yup.number().default(0)
    }),
    ioc_chart: yup.object({
      ip: yup.number().default(0),
      url: yup.number().default(0),
      domain: yup.number().default(0),
      hash: yup.number().default(0),
      sender_email: yup.number().default(0)
    })
  })
})

export type CommonDataValidationValues = yup.InferType<typeof commonDataValidationSchema>
