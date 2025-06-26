import axios from "axios"
import { format } from "date-fns"
import { Response } from "express"
import * as XLSX from "xlsx"

const LOKI_BASE_URL = process.env.LOKI_BASE_URL || 'http://localhost:3100'

const fetchLogs = async ({ startDate, endDate }: { startDate: string, endDate: string }) => {
  const res = await axios.get(`${LOKI_BASE_URL}/loki/api/v1/query_range`, {
    params: {
      query: '{service_name=`secure-sight-api`}',
      limit: 100,
      start: startDate,
      end: endDate,
      direction: 'backward'
    }
  })

  const data = res.data
  if (data.status != 'success') {
    throw new Error("Data fetching failed")
  }

  const result = data.data.result
  let returnData: any[] = [];

  // console.log('res', data, data.data, data.data.result[0].stream)

  result.forEach((r: any) => {
    returnData.push(...r.values)
  })

  returnData.sort((a, b) => b[0] - a[0])

  return returnData
}

class ActivityLogController {
  async getLogs(query?: any) {
    query = query ?? {}
    if (!query.startDate || !query.endDate) throw new Error("Query param is missing")

    try {
      return fetchLogs({
        startDate: query.startDate,
        endDate: query.endDate
      })
    } catch (e: any) {
      throw new Error(e.response?.data || e.message)
    }
  }

  async downloadLogs(query: any, res: Response) {
    query = query ?? {}
    if (!query.startDate || !query.endDate) throw new Error("Query param is missing")

    // res.set({
    //   'Content-Type': 'application/octet-stream',
    //   'Content-Disposition': `attachment; id="activity-log.txt"`
    // });

    const Heading = [["Date", "Log"]];
    const sheet = XLSX.utils.aoa_to_sheet(Heading);

    let startDate = query.startDate
    let endDate = query.endDate

    while (true) {
      const logs = await fetchLogs({
        startDate,
        endDate
      })

      for (let i = 0, l = logs.length; i < l; i++) {
        let log = logs[i]
        XLSX.utils.sheet_add_aoa(sheet, [
          [
            format(log[0] * 1e-6, 'PPpp'),
            log[1]
          ]
        ], { origin: -1 })
      }

      if (logs.length < 100) {
        break;
      } else {
        endDate = logs[logs.length - 1][0]
      }
    }

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Sheet1");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', 'attachment; filename="data_export.xlsx"');
    res.writeHead(200, {
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': 'attachment; filename="activity-log.xlsx"',
      'Cache-Control': 'no-cache', // Prevent caching for dynamic content
      'Connection': 'keep-alive'   // Keep connection open for continuous data
    });
    res.end(buf)
  }
}

export default new ActivityLogController()