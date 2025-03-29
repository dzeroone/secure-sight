import { useCallback, useEffect, useState } from "react"
import ApiServices from "../../Network_call/apiservices"
import ApiEndPoints from "../../Network_call/ApiEndPoints"
import { getAssignmentStatusTitle, getErrorMessage, getRoleTitle } from "../../helpers/utils"
import swal from "sweetalert"
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle"
import { Button, Table } from "reactstrap"
import { formatWeeklyReportSession } from "../../helpers/form_helper"
import { EyeIcon, MessageSquareIcon } from "lucide-react"
import ModalLoading from "../../components/ModalLoading"
import { useProfile } from "../../Hooks/UserHooks"
import { REPORT_AUDIT_STATUS, ROLES } from "../../data/app"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function WeeklySubmissionsPage() {
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])

  const { userProfile } = useProfile()
  const navigate = useNavigate()

  const loadSubmissions = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Assignments}/submissions/weekly`
      )
      setAssignments(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const viewReport = (assignment) => {
    window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?id=${assignment.reportId}`, "_blank")
  }

  const sendReassign = async (assignment) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "You are about to send a reaudit request",
        buttons: {
          cancel: true,
          confirm: true,
        },
      })
      if(confirmed) {
        setBusy(true)
        const res = await ApiServices(
          "post",
          null,
          `${ApiEndPoints.Assignments}/submissions/${assignment.reportId}/reaudit`
        )
        loadSubmissions()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }

  }

  const approveAssignment = async (assignment) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: assignment.isRoot ? "You are about to approve this assignment" : "You are about send approval request for this assignment",
        buttons: {
          cancel: true,
          confirm: true,
        },
      })
      if(confirmed) {
        setBusy(true)
        const res = await ApiServices(
          "post",
          null,
          `${ApiEndPoints.Assignments}/submissions/${assignment.reportId}/approve`
        )
        toast.success('Submitted successfully')
        loadSubmissions()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }

  }

  const getSubmitterInfo = (assignment) => {
    if(!assignment.sCBy) return '-'
    let submitter = 'You'

    if(assignment.reporter._id === assignment.sCBy) {
      submitter = assignment.reporter.fullname
    }else if(assignment.upperAssignment?.assignedBy._id === assignment.sCBy) {
      submitter = assignment.upperAssignment?.assignedBy.fullname
    }

    return `(${submitter})`
  }

  const gotoMessagingScreen = (assingment) => {
    navigate(`/assignments/${assingment._id}`)
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
            {[ROLES.LEVEL2, ROLES.LEVEL1].includes(userProfile.role) ? (
              <th>Assigned By</th>
            ) : null}
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
                <td>{assignment.reporter.fullname} - {getRoleTitle(assignment.reporter.role)} <Button size="sm" onClick={() => gotoMessagingScreen(assignment)}><MessageSquareIcon size="1em" /></Button></td>
                {[ROLES.LEVEL2, ROLES.LEVEL1].includes(userProfile.role) ? (
                  <td>{assignment.upperAssignment?.assignedBy?.fullname} - {getRoleTitle(assignment.upperAssignment?.assignedBy?.role)} <Button size="sm" onClick={() => gotoMessagingScreen(assignment.upperAssignment)}><MessageSquareIcon size="1em" /></Button></td>
                ): null}
                <td>{getAssignmentStatusTitle(assignment.status)} changed by {getSubmitterInfo(assignment)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button size="sm" onClick={() => viewReport(assignment)}>
                      <EyeIcon size="1rem" />
                    </Button>
                    {assignment.status !== REPORT_AUDIT_STATUS.APPROVED ? (
                      <>
                        <Button size="sm" onClick={() => sendReassign(assignment)} color="danger">
                          Reassign
                        </Button>
                        <Button size="sm" onClick={() => approveAssignment(assignment)} color="success">
                          {assignment.isRoot ? 'Approve' : 'Submit for approval'}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
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