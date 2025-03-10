import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Badge, Col, Container, FormGroup, Label, Table } from "reactstrap";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import ApiServices from "../../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../../components/Common/BreadcrumbWithTitle";
import DropdownReportAssignment from "../../../components/DropdownReportAssignment";
import ModalLoading from "../../../components/ModalLoading";
import { getMonthlyReportIndex } from "../../../helpers/form_helper";
import { getRoleTitle } from "../../../helpers/utils";

const linkStack = [
  {title: 'Dashboard', route: '/dashboard'},
  {title: 'Assign monthly reports', route: '/assign/monthly-report'}
]

export default function AssignMonthlyReportPage() {
  const [date, setDate] = useState(null)
  const [busy, setBusy] = useState(false)

  const [customers, setCustomers] = useState([])

  const getAssignments = useCallback(async () => {
    if(!date) return
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        {
          date: format(date, "yyyy-MM-dd")
        },
        `${ApiEndPoints.Assignments}/monthly`
      )
      setCustomers(res)
    }catch(e){
      console.log(e)
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [date])

  const onAssigned = useCallback(async (customerId, info) => {
    setCustomers(customers => {
      return customers.map(c => {
        if(c._id === customerId) {
          c.assignments = [...c.assignments, info]
        }
        return c
      })
    })
  }, [])

  const onUnAssigned = useCallback(async (customerId, assignmentId) => {
    setCustomers(customers => {
      return customers.map(c => {
        if(c._id === customerId) {
          c.assignments = c.assignments.filter(a => a._id !== assignmentId)
        }
        return c
      })
    })
  }, [])

  useEffect(() => {
    getAssignments()
  }, [getAssignments])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Assign monthly reports" linkStack={linkStack} />
      <Container fluid>
        <FormGroup row className="p-2" style={{background: 'var(--bs-pitch-black)'}}>
          <Label sm={2}>Select a month</Label>
          <Col sm={4}>
            <ReactDatePicker
              className={`form-control`}
              name="selectedDate"
              selected={date}
              onChange={(date) => setDate(date)}
              showMonthYearPicker
              showFullMonthYearPicker
              autoComplete="off"
            />
          </Col>
        </FormGroup>
      </Container>
      <Table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Reporters</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => {
            return (
              <tr key={customer._id}>
                <td>
                  <div>{customer.name}</div>
                  <div>Tenant code: {customer.tCode}</div>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    {customer.assignments.map(assignment => {
                      return (
                        <Badge tag='div' key={assignment._id}>
                          <div>{assignment.reporter.fullname}</div>
                          <div>{getRoleTitle(assignment.reporter.role)}</div>
                        </Badge>
                      )
                    })}
                    <div className="d-inline-flex">
                      <DropdownReportAssignment
                        key={date}
                        date={date}
                        index={getMonthlyReportIndex(date, customer.tCode)}
                        customerId={customer._id}
                        assignments={customer.assignments}
                        onAssigned={onAssigned}
                        onUnAssigned={onUnAssigned}
                      />
                    </div>
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