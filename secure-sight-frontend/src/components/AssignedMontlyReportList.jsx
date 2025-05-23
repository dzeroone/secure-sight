import { Fragment, useCallback, useEffect, useState } from "react"
import ModalLoading from "./ModalLoading"
import ApiServices from '../Network_call/apiservices'
import ApiEndPoints from "../Network_call/ApiEndPoints"
import { Alert, Button, Table } from "reactstrap"
import { EyeIcon, FileStack, MessageSquareIcon } from "lucide-react"
import { format } from "date-fns"
import { formatMonthlyReportSession } from "../helpers/form_helper"
import { useNavigate } from "react-router-dom"
import { REPORT_AUDIT_STATUS } from "../data/app"

export default function AssignedMonthlyReportList() {
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])

  const navigate = useNavigate()
  
  const loadAssignments = useCallback(async () => {
    try {
      setBusy(true)
      const res= await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/me/monthly-assignments`
      )
      setAssignments(res)
    }catch(e) {
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [])

  const viewReport = (assignment) => {
    if(assignment.reportId) {
      window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report?id=${assignment.reportId}`, "_blank")
    }else if(assignment.savedReport){
      window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report?id=${assignment.savedReport._id}`, "_blank")
    }
    else{
      window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report?index=${assignment.index}`, "_blank")
    }
  }

  const gotoMessagePage = (assignment) => {
    navigate(`/assignments/${assignment._id}`)
  }

  useEffect(() => {
    loadAssignments()
  }, [loadAssignments])

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <td colSpan={4}>
              <a
                href={`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report/saved`}
                className="btn btn-outline-primary"
                target="_blank"
              ><FileStack className="mr-1" size="1rem" /> Saved reports</a>
            </td>
          </tr>
          <tr>
            <th>Customer</th>
            <th>Report session</th>
            <th>Assign date</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => {
            return (
              <Fragment key={assignment._id}>
                <tr>
                  <th className={assignment.instruction ? "border-0" : ""}>{assignment.customer?.name}</th>
                  <td className={assignment.instruction ? "border-0" : ""}>{formatMonthlyReportSession(assignment.date)}</td>
                  <td className={assignment.instruction ? "border-0" : ""}>{format(assignment.cAt, 'PP')}</td>
                  <td rowSpan={assignment.instruction ? 2 : 1}>
                    <Button size="sm" onClick={() => viewReport(assignment)} className="me-1">
                      <EyeIcon />
                    </Button>
                    {assignment.sBy && assignment.status !== REPORT_AUDIT_STATUS.APPROVED ? (
                      <Button size="sm" onClick={() => gotoMessagePage(assignment)}>
                        <MessageSquareIcon />
                      </Button>
                    ) : null}
                  </td>
                </tr>
                {assignment.instruction ? (
                  <tr>
                    <td colSpan={3}>
                      <Alert color="info"><div><strong>Instruction:</strong></div><div>{assignment.instruction}</div></Alert>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </Table>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}