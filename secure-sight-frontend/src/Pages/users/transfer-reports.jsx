import { ArchiveIcon, GitPullRequestIcon, Trash2Icon, ZapIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, ListGroup, ListGroupItem, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip } from "reactstrap";
import swal from "sweetalert";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import ModalLoading from "../../components/ModalLoading";
import TableView from "../../components/TableView";
import { extractInfoFromIndex, formatMonthlyReportSession, formatWeeklyReportSession } from "../../helpers/form_helper";
import { getErrorMessage } from "../../helpers/utils";

const responsibilities = {
  ASSIGNEE: 'Assignee',
  REPORTER: 'Reporter',
  REVIEWER: 'Reviewer',
  REPORT_CREATOR: 'Report creator'
}

export default function TransferReportsPage() {
  const { id } = useParams()
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)

  const loadPendingAssignments = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.Users}/${id}/pending-assignments`
      )
      setAssignments(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [id])

  const loadUser = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.Users}/${id}`
      )
      setUser(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [id])

  const loadUsers = useCallback(async () => {
    try {
      setBusy(true)
      const data = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.Users}/${id}/transfer-suggestions`
      )
      setUsers(data)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [id])

  const getReponsibilities = (assignment) => {
    const data = []
    if(assignment.aBy == id) {
      data.push(responsibilities.ASSIGNEE)
    }
    if(assignment.sTo == id) {
      data.push(responsibilities.REVIEWER)
    }else if(assignment.sBy == id) {
      data.push(responsibilities.REPORT_CREATOR)
    }

    if(assignment.reporterId == id && assignment.sTo != assignment.reporterId && assignment.sBy != assignment.reporterId) {
      data.push(responsibilities.REPORTER)
    }
    return data
  }

  const onTransferUserSelected = async (assignment, user, responsibility) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: `You are going to transfer (${responsibility}) reponsibility to ${user.fullname}`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true
        }
      })
      if(confirmed) {
        setBusy(true)

        await ApiServices(
          "post",
          {
            fromUserId: id,
            toUserId: user._id,
            task: responsibility
          },
          `${ApiEndPoints.Assignments}/${assignment._id}/transfer-tasks`
        )
        toast.success("Task has been reassigned successfully.")
        loadPendingAssignments()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const onClickArchive = async (assignment) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "You are going to archive this report.",
        icon: "warning",
        buttons: {
          cancel: true,
          confirm: true
        }
      })

      if(confirmed) {
        setBusy(true)
        const res = await ApiServices(
          "post",
          null,
          `${ApiEndPoints.Assignments}/${assignment._id}/archive`
        )
        toast.success("Report archived.")
        loadPendingAssignments()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const onClickRemove = async (assignment) => {
    try {
      const confirmed = await swal({
        title: "Are you sure?",
        text: "You are going to remove this report.",
        icon: "warning",
        buttons: {
          cancel: true,
          confirm: true
        }
      })

      if(confirmed) {
        setBusy(true)
        const res = await ApiServices(
          "post",
          null,
          `${ApiEndPoints.Assignments}/${assignment._id}/force-remove`
        )
        toast.success("Report removed.")
        loadPendingAssignments()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  useEffect(() => {
    loadPendingAssignments()
  }, [loadPendingAssignments])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Transfer reports" linkStack={[{
        title: 'Users',
        route: '/users'
      },{
        title: user?.fullname || id,
        route: `/users/${id}`
      }]} />
      <div>
        <TableView
          columns={[{
            key: 'rType',
            title: "Report Type"
          }, {
            key: 'session',
            title: 'Session',
            onRenderRow: (data) => {
              const info = extractInfoFromIndex(data.index)
              return `${data.rType == 'monthly' ? formatMonthlyReportSession(info.date) : formatWeeklyReportSession(info.date)} - ${info.tCode.toUpperCase()}`
            }
          }, {
            key: 'responsibility',
            title: "Transfer to",
            onRenderRow: (data) => {
              return getReponsibilities(data).map((r, i) => {
                return <div className="mb-1" key={i}>{r} <TransferPopover assignment={data} users={users} reponsibility={r} onClickTransfer={(user) => onTransferUserSelected(data, user, r)} /></div>
              })
            }
          },{
            key: 'actions',
            onRenderRow: (data) => {
              return (
                <>
                  <div className="d-flex gap-1">
                    <Button id={`adi-${data._id}`} size="sm" color="info" onClick={() => onClickArchive(data)}>
                      <ArchiveIcon size='1rem' />
                    </Button>
                    <Button id={`adt-${data._id}`} size="sm" color="danger" onClick={() => onClickRemove(data)}>
                      <Trash2Icon size='1rem' />
                    </Button>
                  </div>
                  <UncontrolledTooltip target={`adi-${data._id}`} placement="top">
                    Archive
                  </UncontrolledTooltip>
                  <UncontrolledTooltip target={`adt-${data._id}`} placement="top">
                    Remove
                  </UncontrolledTooltip>
                </>
              )
            }
          }]}
          data={assignments}
        />
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}

function TransferPopover({assignment, users, reponsibility, onClickTransfer}) {
  const [isOpen, setIsOpen] = useState(false)

  const rId = reponsibility.replaceAll(" ", "_").toLowerCase()

  return (
    <>
      <Button size="sm" id={'popbtn' + assignment._id + rId} onClick={() => setIsOpen(true)}><GitPullRequestIcon size="1rem" /></Button>
      <Popover isOpen={isOpen} toggle={() => setIsOpen(false)} target={'popbtn' + assignment._id + rId} placement="left">
        <PopoverHeader>
          Transfer to
        </PopoverHeader>
        <PopoverBody>
          <ListGroup>
            {users.map(u => {
              return <ListGroupItem className="d-flex justify-content-between gap-2" key={u._id}>
                {u.fullname}
                <div><Button size="sm" onClick={() => onClickTransfer(u)}>Transfer</Button></div>
              </ListGroupItem>
            })}
          </ListGroup>
        </PopoverBody>
      </Popover>
      <UncontrolledTooltip target={'popbtn' + assignment._id + rId} placement="top">Transfer report</UncontrolledTooltip>
    </>
  )
}