import { format } from "date-fns"
import { EyeIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button, Table } from "reactstrap"
import { formatWeeklyReportSession } from "../helpers/form_helper"
import ApiEndPoints from "../Network_call/ApiEndPoints"
import ApiServices from '../Network_call/apiservices'
import ModalLoading from "./ModalLoading"

export default function AssignedWeeklyReportList() {
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])
  
  const loadAssignments = useCallback(async () => {
    try {
      setBusy(true)
      const res= await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/me/weekly-assignments`
      )
      setAssignments(res)
    }catch(e) {
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [])

  const viewReport = (assignment) => {
    window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?index=${assignment.index}`, "_blank")
  }

  useEffect(() => {
    loadAssignments()
  }, [loadAssignments])

  return (
    <div>
      <Table>
        <thead>
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
              <tr key={assignment._id}>
                <th>{assignment.customer.name}</th>
                <td>{formatWeeklyReportSession(assignment.date)}</td>
                <td>{format(assignment.cAt, 'PP')}</td>
                <td>
                  <Button size="sm" onClick={() => viewReport(assignment)}>
                    <EyeIcon />
                  </Button>
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