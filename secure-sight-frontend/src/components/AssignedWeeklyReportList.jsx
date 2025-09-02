import { format } from "date-fns"
import { EyeIcon, FileStack, MessageSquareIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button, Table } from "reactstrap"
import { formatWeeklyReportSession } from "../helpers/form_helper"
import ApiEndPoints from "../Network_call/ApiEndPoints"
import ApiServices from '../Network_call/apiservices'
import ModalLoading from "./ModalLoading"
import { useNavigate } from "react-router-dom"

export default function AssignedWeeklyReportList() {
  const [busy, setBusy] = useState(false)
  const [assignments, setAssignments] = useState([])
  
  const navigate = useNavigate()
  
  const loadAssignments = async (pageQuery) => {
    try {
      setBusy(true)

      let query = ""
      if(pageQuery?.next) {
        query = `?prev=${assignments[assignments.length - 1].cAt}`
      }else if(pageQuery?.prev) {
        query = `?next=${assignments[0].cAt}`
      }

      const res= await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/me/weekly-assignments${query}`
      )
      
      if(res.length) {
        if(pageQuery?.next) {
          setPagination(s => ({
            ...s,
            hasNextPage: true
          }))
        }else if(pageQuery?.prev) {
          setPagination(s => ({
            ...s,
            hasPrevPage: true
          }))
        }

        setAssignments(res)

      }else{
        if(pageQuery?.next) {
          setPagination(s => ({
            ...s,
            hasNextPage: false
          }))
        }else if(pageQuery?.prev) {
          setPagination(s => ({
            ...s,
            hasPrevPage: false
          }))
        }
      }
    }catch(e) {
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }

  const viewReport = (assignment) => {
    if(assignment.reportId){
      window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?id=${assignment.reportId}`, "_blank")
    }else if(assignment.savedReport){
      window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?id=${assignment.savedReport._id}`, "_blank")
    }
    else
      window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?index=${assignment.index}`, "_blank")
  }

  const gotoMessagePage = (assignment) => {
    navigate(`/assignments/${assignment._id}`)
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <td colSpan={4}>
              <a
                href={`${process.env.REACT_APP_WEEKLY_REPORT_BASE}/saved`}
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
              <tr key={assignment._id}>
                <th>{assignment.customer.name}</th>
                <td>{formatWeeklyReportSession(assignment.date)}</td>
                <td>{format(assignment.cAt, 'PP')}</td>
                <td>
                  <Button size="sm" onClick={() => viewReport(assignment)} className="me-1">
                    <EyeIcon />
                  </Button>
                  <Button size="sm" onClick={() => gotoMessagePage(assignment)}>
                    <MessageSquareIcon />
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