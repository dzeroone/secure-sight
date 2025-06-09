import axios from "axios"

const LOKI_BASE_URL = process.env.LOKI_BASE_URL || 'http://localhost:3100'

class ActivityLogController {
  async getLogs(query?: any) {
    query = query ?? {}
    if(!query.startDate || !query.endDate) throw new Error("Query param is missing")

    try {
      const res = await axios.get(`${LOKI_BASE_URL}/loki/api/v1/query_range`, {
        params: {
          query: '{service_name=`secure-sight-api`}',
          limit: 100,
          start: query.startDate,
          end: query.endDate
        }
      })

      const data = res.data
      if(data.status != 'success') {
        throw new Error("Data fetching failed")
      }

      const result = data.data.result
      let returnData: any[] = [];

      // console.log('res', data, data.data, data.data.result[0].stream)

      result.forEach((r: any) => {
        returnData.push(...r.values)
      })

      return returnData
    }catch(e: any) {
      throw new Error(e.response?.data || e.message)
    }
  }
}

export default new ActivityLogController()