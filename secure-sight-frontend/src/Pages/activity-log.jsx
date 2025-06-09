import { useCallback, useEffect, useState } from "react"
import BreadcrumbWithTitle from "../components/Common/BreadcrumbWithTitle"
import { getErrorMessage } from "../helpers/utils"
import { toast } from "react-toastify"
import ApiServices from "../Network_call/apiservices"
import ApiEndPoints from "../Network_call/ApiEndPoints"
import ModalLoading from "../components/ModalLoading"
import { Button, FormGroup, Input, Label, Table } from "reactstrap"
import { format } from "date-fns"

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([])
  const [busy, setBusy] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeFilter, setActiveFilter] = useState({
    startDate: '',
    endDate: ''
  })

  const loadLogs = useCallback(async () => {
    try {
      if(!activeFilter.startDate || !activeFilter.endDate) return
      setBusy(true)
      const data = await ApiServices(
        "get",
        {
          startDate: activeFilter.startDate,
          endDate: activeFilter.endDate
        },
        ApiEndPoints.ActivityLogs
      )
      setLogs(data.map(l => {
        return {
          date: l[0],
          data: JSON.parse(l[1])
        }
      }))
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [activeFilter])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  useEffect(() => {
    // set start date and end date to datetime-local time format
    // to populate the input field
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    const _15minBefore = new Date()
    _15minBefore.setMinutes(_15minBefore.getMinutes() - _15minBefore.getTimezoneOffset());
    _15minBefore.setMinutes(_15minBefore.getMinutes() - 15)

    const sD = _15minBefore.toISOString().slice(0,16)
    const eD = now.toISOString().slice(0,16)
    setStartDate(sD)
    setEndDate(eD)

    setActiveFilter({
      startDate: new Date(sD).toISOString(),
      endDate: new Date(eD).toISOString()
    })
  }, [])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Activity log" />
      <div className="d-flex justify-content-between">
        <div>Filter</div>
        <div className="d-flex gap-2">
          <div>
            <FormGroup>
              <Label size="sm">Start date</Label>
              <Input
                name="start_date"
                type="datetime-local"
                bsSize="sm"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                }}
              />
            </FormGroup>
          </div>
          <div>
            <FormGroup>
              <Label size="sm">End date</Label>
              <Input
                name="end_date"
                type="datetime-local"
                bsSize="sm"
                value={endDate}
                onChange={(e) => {
                  console.log("SAA", e.target.value, typeof e.target.value, e.target.value instanceof Date)
                  setEndDate(e.target.value)
                }}
              />
            </FormGroup>
          </div>
          <div>
            <FormGroup>
              <Label size="sm">&nbsp;</Label>
              <div><Button size="sm" onClick={() => {
                setActiveFilter({
                  startDate: startDate ? new Date(startDate).toISOString() : '',
                  endDate: endDate ? new Date(endDate).toISOString() : ''
                })
              }}>Apply</Button></div>
            </FormGroup>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Table>
          <tbody>
            {
              logs.map((l, i) => {
                return (
                  <tr key={i}>
                    <td>{format(l.date * 1e-6, "PPpp")}</td>
                    <td>{l.data.body}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => {
          setBusy(false)
        }}
      />
    </div>
  )
}