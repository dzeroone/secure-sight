import { format } from "date-fns"
import { Link } from "react-router-dom"
import { formatMonthlyReportSession, formatWeeklyReportSession } from "../helpers/form_helper"

export default function ListPendingAssignmentReviews({ data }) {
  if(!(Array.isArray(data) && data.length)) return null

  return (
    <div>
      {data.map(info => {
        return (
          <div className="d-flex justify-content-between gap-1" key={info._id}>
            <div>
              <div>A {info.rType} report has been submitted by {info.reporter.fullname} for session ({info.rType === 'monthly' ? formatMonthlyReportSession(info.date): formatWeeklyReportSession(info.date)})</div>
              <div><small>{format(info.uAt, 'PPpp')}</small></div>
            </div>
            <div><Link className="btn btn-outline-info btn-sm" to={`/submissions/${info.rType === 'monthly' ? 'monthly-report' : 'weekly-report'}`}>View changes</Link></div>
          </div>
        )
      })}
    </div>
  )
}