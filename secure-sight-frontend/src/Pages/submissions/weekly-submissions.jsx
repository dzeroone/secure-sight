import { useCallback, useEffect, useState } from "react"
import ApiServices from "../../Network_call/apiservices"
import ApiEndPoints from "../../Network_call/ApiEndPoints"
import { getAssignmentStatusTitle, getErrorMessage, getRoleTitle } from "../../helpers/utils"
import swal from "sweetalert"
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle"
import { Button, Table } from "reactstrap"
import { formatWeeklyReportSession } from "../../helpers/form_helper"
import { EyeIcon } from "lucide-react"

export default function WeeklySubmissionsPage() {
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])

  const loadSubmissions = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Assignments}/weekly-submissions`
      )
      setAssignments(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const viewReport = (assignment) => {
    window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?id=${assignment.reportId}`, "_blank")
  }

  const sendReaudit = async (assignment) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "You are about to send a reaudit request"
      })
      if(confirmed) {
        setBusy(true)
        const res = await ApiServices(
          "post",
          null,
          `${ApiEndPoints.Assignments}/weekly-submissions/${assignment.reportId}/reaudit`
        )
        loadSubmissions()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }

  }

  const approveAssignment = async (assignment) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "You are about to approve this assignment"
      })
      if(confirmed) {
        setBusy(true)
        const res = await ApiServices(
          "post",
          null,
          `${ApiEndPoints.Assignments}/weekly-submissions/${assignment.reportId}/approve`
        )
        loadSubmissions()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }

  }

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Weekly report submissions" />
      <Table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Report session</th>
            <th>Reporter</th>
            <th>Status</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => {
            return (
              <tr key={assignment._id}>
                <td>{assignment.customer.name}</td>
                <td>{formatWeeklyReportSession(assignment.date)}</td>
                <td>{assignment.reporter.fullname} - {getRoleTitle(assignment.reporter.role)}</td>
                <td>{getAssignmentStatusTitle(assignment.status)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button size="sm" onClick={() => viewReport(assignment)}>
                      <EyeIcon size="1rem" />
                    </Button>
                    <Button size="sm" onClick={() => sendReaudit(assignment)} color="danger">
                      Reaudit
                    </Button>
                    <Button size="sm" onClick={() => approveAssignment(assignment)} color="success">
                      {assignment.isRoot ? 'Approve' : 'Submit for approval'}
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}