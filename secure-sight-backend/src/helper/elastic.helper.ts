import axios from "axios"
import { ELASTIC_INDICES } from "../constant"

export const createElasticIndices = async () => {
  let exists = true
  try {
    const res = await axios.head(`${process.env.ELASTIC_BASE}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}`)
  } catch (e: any) {
    exists = false
    console.log(e.response.data)
  }

  if (!exists) {
    try {
      const res = await axios.put(`${process.env.ELASTIC_BASE}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}`, {
        mappings: {
          dynamic: false,
          properties: {
            savedAt: {
              type: 'date',
              index: true
            },
            monthly_report: {
              type: 'object',
              dynamic: true
            }
          }
        }
      })
    } catch (e: any) {
      console.log(e.response.data.error)
    }
  }
}