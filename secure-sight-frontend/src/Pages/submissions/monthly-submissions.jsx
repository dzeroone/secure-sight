import { useCallback, useEffect, useRef, useState } from "react"
import ApiServices from "../../Network_call/apiservices"
import ApiEndPoints from "../../Network_call/ApiEndPoints"
import { getAssignmentStatusTitle, getErrorMessage, getRoleTitle } from "../../helpers/utils"
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle"
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Table, UncontrolledTooltip } from "reactstrap"
import { formatMonthlyReportSession } from "../../helpers/form_helper"
import { ArchiveIcon, EyeIcon, MessageSquareIcon } from "lucide-react"
import swal from "sweetalert"
import { REPORT_AUDIT_STATUS, ROLES } from "../../data/app"
import { useProfile } from "../../Hooks/UserHooks"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ModalLoading from "../../components/ModalLoading"

export default function MonthlySubmissionsPage() {
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])
  
  const [selectReporterShown, setSelectReporterShown] = useState(false);
  const [reporters, setReporters] = useState([]);
  const [selectedReporter, setSelectedReporter] = useState("");

  const currentAssignmentRef = useRef('')

  const {userProfile} = useProfile()
  const navigate = useNavigate()

  const loadSubmissions = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Assignments}/submissions/monthly`
      )
      setAssignments(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const loadReporters = useCallback(async () => {
    if (!selectReporterShown) return;
    try {
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Assignments}/${currentAssignmentRef.current.upperAssignment._id}/suggest-reporters`
      );
      setReporters(res);
    } catch (e) {
    }
  }, [selectReporterShown]);

  const viewReport = (assignment) => {
    window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report?id=${assignment.reportId}`, "_blank")
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
        toast.success("Successfully re-assigned.")
        if([ROLES.LEVEL3, ROLES.LEVEL2].includes(userProfile.role)) {
          gotoMessagingScreen(assignment)
          return
        }
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
      setBusy(true)
      const res = await ApiServices(
        "post",
        {
          submittedTo: selectedReporter
        },
        `${ApiEndPoints.Assignments}/submissions/${assignment.reportId}/approve`
      )
      toast.success('Submitted successfully')
      loadSubmissions()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }

  }

  const onApproveAssignment = async (assignment) => {
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
        if(assignment.isRoot) {
          approveAssignment(assignment)
        }else{
          currentAssignmentRef.current = assignment
          setSelectReporterShown(true)
        }
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

  useEffect(() => {
    loadReporters()
  }, [loadReporters])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Monthly report submissions" />
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
                <td>{assignment.customer?.name}</td>
                <td>{formatMonthlyReportSession(assignment.date)}</td>
                <td>{assignment.reporter.fullname} - {getRoleTitle(assignment.reporter.role)}</td>
                {[ROLES.LEVEL2, ROLES.LEVEL1].includes(userProfile.role) ? (
                  <td>{assignment.upperAssignment?.assignedBy?.fullname} - {getRoleTitle(assignment.upperAssignment?.assignedBy?.role)}</td>
                ): null}
                <td>{getAssignmentStatusTitle(assignment.status)} by {getSubmitterInfo(assignment)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button size="sm" onClick={() => viewReport(assignment)} disabled={busy}>
                      <EyeIcon size="1rem" />
                    </Button>
                    {assignment.status !== REPORT_AUDIT_STATUS.APPROVED ? (
                      <>
                        <Button size="sm" onClick={() => sendReassign(assignment)} color="danger" disabled={busy}>
                          Reassign
                        </Button>
                        <Button size="sm" onClick={() => onApproveAssignment(assignment)} color="success" disabled={busy}>
                          {assignment.isRoot ? 'Approve' : 'Submit for approval'}
                        </Button>
                      </>
                    ): null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Modal isOpen={selectReporterShown} toggle={() => setSelectReporterShown(!selectReporterShown)}>
        <ModalHeader>Select reporter</ModalHeader>
        <ModalBody>
          <Input
            type="select"
            value={selectedReporter}
            onChange={(e) => {
              setSelectedReporter(e.target.value)
            }}
          >
            <option value='' disabled>None</option>
            {reporters.map(r => {
              return <option value={r._id} key={r._id}>{r.fullname}</option>
            })}
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => {
            setSelectReporterShown(false)
            approveAssignment(currentAssignmentRef.current)
          }} disabled={busy}>Submit</Button>
        </ModalFooter>
      </Modal>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}