import { Button, Input, Label } from "reactstrap";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, getRoleTitle } from "../../helpers/utils";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { useParams } from "react-router-dom";
import { SendIcon } from "lucide-react";
import { formatMonthlyReportSession, formatWeeklyReportSession, getMonthlyReportIndex } from "../../helpers/form_helper";
import ModalLoading from "../../components/ModalLoading";

export default function AssignmentMessagePage() {
  const [busy, setBusy] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [selectedPage, setSelectedPage] = useState()
  const [message, setMessage] = useState('')
  const [messageState, setMessageState] = useState({
    info: {},
    messages: []
  })

  const {id} = useParams()

  const loadAssignmentMessages = useCallback(async () => {
    try {
      setBusy(true)

      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Assignments}/${id}/messages`
      )
      setMessageState(s => {
        return {
          ...s,
          info: res.info,
          messages: res.messages
        }
      })
    }catch(e){
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const sendMessage = async () => {
    try {
      setSendingMessage(true)
      const res = await ApiServices(
        'post',
        {
          message: selectedPage ? `Page: ${selectedPage}\n${message}` : message
        },
        `${ApiEndPoints.Assignments}/${id}/messages`
      )
      setSelectedPage('')
      setMessage('')
      loadAssignmentMessages()
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setSendingMessage(false)
    }
  }

  const getMessanger = (id) => {
    return messageState.info?.assignee?._id === id ?
      messageState.info?.assignee.fullname : messageState.info?.reporter?._id === id ? messageState.info?.reporter.fullname : null
  }

  const getReportSession = () => {
    if(!messageState.info.date) return ''
    if(messageState.info.rType === 'monthly') return formatMonthlyReportSession(messageState.info.date)
    return formatWeeklyReportSession(messageState.info.date)
  }

  useEffect(() => {
    loadAssignmentMessages()
  }, [loadAssignmentMessages])

  return (
    <div className="page-content h-100 pb-0 d-flex flex-column">
      <BreadcrumbWithTitle title="Feedbacks" />
      <div className="px-2 py-1" style={{ background: "var(--bs-pitch-black)"}}>
        <div className="d-flex gap-5">
          <div>
            <div>Customer: { messageState.info?.customer?.name }</div>
            <div>Assignee: { messageState.info?.assignee?.fullname } - { getRoleTitle(messageState.info?.assignee?.role) }</div>
            <div>Reporter: { messageState.info?.reporter?.fullname } - { getRoleTitle(messageState.info?.reporter?.role) }</div>
          </div>
          <div className="flex-grow-1">
            <div>Report Type: {messageState.info?.rType}</div>
            <div>Report session: {getReportSession()}</div>
          </div>
        </div>
      </div>
      <div className="flex-grow-1 overflow-y-auto position-relative" style={{ scrollbarWidth: 'thin' }}>
        <div className="py-4 d-flex flex-column justify-content-end position-absolute left-0 w-100" style={{ minHeight: '100%'}}>
          { messageState.messages.map((m) => {
            return (
              <div key={m._id} className="mb-2">
                <div><strong>{getMessanger(m.sId)}</strong></div>
                <div className="message">{m.msg}</div>
              </div>
            )
          }) }
        </div>
      </div>
      <hr className="m-0 mb-2" />
      <div className="d-flex gap-1">
        <div>
          <Label>Page</Label>
          <Input
            type="select"
            value={selectedPage}
            style={{ width: '6rem'}}
            onChange={(e) => {
              setSelectedPage(e.target.value)
            }}
          >
            <option value=''>None</option>
            {Array.from({ length: 27 }).map((_, i) => {
              return (
                <option value={i+1} key={i}>{i+1}</option>
              )
            })}
          </Input>
        </div>
        <Input
          type="textarea"
          value={message}
          placeholder="Write your feedback ..."
          rows={2}
          style={{ resize: 'none' }}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
        <Button disabled={sendingMessage} onClick={sendMessage} color="info" className="text-black"><SendIcon /> Send</Button>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}