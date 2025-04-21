import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import ApiEndPoints from "../Network_call/ApiEndPoints";
import ApiServices from "../Network_call/apiservices";
import { CheckIcon } from "lucide-react";
import { getErrorMessage, getRoleTitle } from "../helpers/utils";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function DropdownReportAssignment({
  customerId,
  date,
  index,
  assignments,
  onAssigned,
  onUnAssigned,
  reportType = 'monthly' // monthly | weekly
}) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [instructionMessage, setInstructionMessage] = useState('')
  const instructionModalOnCompleteRef = useRef(null)
  const [affectedUserId, setAffectedUserId] = useState(false) // holds which userid is currently in operation of assignment or unassignment
  const [instructionInputModalShown, setInstructionInputModalShown] = useState(false)

  // find user timeout ref
  const fuTimeoutRef = useRef(null)

  const findUsers = useCallback(async ()=> {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        {
          search,
          index
        },
        `${ApiEndPoints.Users}/search`
      )

      setUsers(res.map(u => {
        const assignment = assignments.find(a => a.reporter._id === u._id)
        if(assignment) {
          return {
            ...u,
            assigned: true,
            assignmentId: assignment._id
          }
        }
        return u
      }))
    }catch(e) {
      alert(e.message)
      console.error(e)
    }finally{
      setBusy(false)
    }
  }, [search, assignments])

  const assign = useCallback(async (user) => {
    try {
      const message = await getInstructionMessage()
      setBusy(true)
      setAffectedUserId(user._id)

      const data = await ApiServices(
        'post',
        {
          index,
          date: format(date, 'yyyy-MM-dd'),
          customerId,
          reporterId: user._id,
          message
        },
        `${ApiEndPoints.Assignments}/${reportType}/assign`
      )
      onAssigned(customerId, {
        _id: data._id,
        reporter: {
          _id: data.reporterId,
          fullname: user.fullname,
          role: user.role
        }
      })
    }catch(e) {
      console.error(e)
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
      setAffectedUserId(null)
    }
  }, [])

  const unAssign = useCallback(async (user) => {
    try {
      setBusy(true)
      setAffectedUserId(user._id)

      await ApiServices(
        'delete',
        null,
        `${ApiEndPoints.Assignments}/${user.assignmentId}`
      )
      onUnAssigned(customerId, user.assignmentId)
    }catch(e) {
      alert(e.message)
      console.error(e)
    }finally{
      setBusy(false)
      setAffectedUserId(null)
    }
  }, [])

  const getInstructionMessage = async () => {
    instructionModalOnCompleteRef.current = null
    const p = new Promise((resolve, _) => {
      instructionModalOnCompleteRef.current = resolve
      setInstructionInputModalShown(true)
    })

    return p
  }

  useEffect(() => {
    if(fuTimeoutRef.current) {
      clearTimeout(fuTimeoutRef.current)
    }
    if(!isOpen) return
    fuTimeoutRef.current = setTimeout(findUsers, 600)
    return () => {
      if(fuTimeoutRef.current) {
        clearTimeout(fuTimeoutRef.current)
      }
    }
  }, [findUsers, isOpen])

  // sync user list when assignments changes
  useEffect(() => {
    setUsers((state) => {
      const newS = state.map(u => {
        const assignment = assignments.find(a => a.reporter._id === u._id)
        if(assignment) {
          return {
            ...u,
            assigned: true,
            assignmentId: assignment._id
          }
        }
        return {
          ...u,
          assigned: false
        }
      })
      return newS
    })
  }, [assignments])

  return (
    <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} direction="start" size="sm">
      <DropdownToggle>
        Assign
      </DropdownToggle>
      <DropdownMenu style={{ minWidth: '300px', maxHeight: '400px', overflow: 'auto' }}>
        <DropdownItem header>
          Report assignment
        </DropdownItem>
        <div className="px-2 py-1">
          <Input
            placeholder="Search users.."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
        </div>
        <div className="list-group">
        {users.map(u => {
          return (
            <div className="list-group-item d-flex align-items-center gap-1" key={u._id}>
              <div className="flex-grow-1 d-flex align-items-center gap-1">
                <div>
                  {u.assigned ? (
                    <CheckIcon className="text-success" style={{width: "1rem", height: "1rem"}} />
                  ) : <div style={{width: "1rem", height: "1rem"}}></div>}
                </div>
                <div>
                  {u.fullname}
                  <div className="text-muted small">{getRoleTitle(u.role)}</div>
                </div>
              </div>
              <div>
                {busy && (affectedUserId === u._id) ? (
                  <Spinner size='sm' color="primary" />
                ) : (
                  <Button size="sm" onClick={() => u.assigned? unAssign(u) : assign(u)} disabled={busy}>
                    {u.assigned ? 'Remove' : 'Assign'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
        {!users.length ? (
          <div className="list-group-item">
            No user found!
          </div>
        ) : null}
        </div>
      </DropdownMenu>
      <Modal isOpen={instructionInputModalShown} onClosed={() => {
        setInstructionInputModalShown(false)
        instructionModalOnCompleteRef.current(instructionMessage)
      }}>
        <ModalHeader>Instruction for reporter</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder="Write instructions ..."
            value={instructionMessage}
            onChange={(e) => {
              setInstructionMessage(e.target.value)
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => {
            setInstructionInputModalShown(false)
            instructionModalOnCompleteRef.current(instructionMessage)
          }}>Done</Button>
        </ModalFooter>
      </Modal>
    </Dropdown>
  )
}