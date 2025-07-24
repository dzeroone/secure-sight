import { XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, ButtonGroup, Nav, NavItem, NavLink, Spinner, Table } from "reactstrap";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import DropdownScheduleUsers from "../../components/DropdownScheduleUsers";
import { getErrorMessage, getRoleTitle } from "../../helpers/utils";

export default function AutoReportAssignPage() {
  const [activeTab, setActiveTab] = useState('monthly')

  const [busy, setBusy] = useState(false)
  const [customers, setCustomers] = useState([])

  const loadCustomers = useCallback(async () => {
    try {
      setBusy(true)
      setCustomers([])
      const data = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.Assignments}/schedules/${activeTab}`
      )
      setCustomers(data)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [activeTab])

  const removeSchedule = async (customer) => {
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        text: 'Your action will remove this schedule.',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true
        }
      }) 
      if(!confirmed) return 
      
      setBusy(true)
      await ApiServices(
        'delete',
        null,
        `${ApiEndPoints.Assignments}/schedules/${customer.schedule._id}`
      )
      loadCustomers()
    }catch(e) {
      const msg = getErrorMessage(e)
      alert(msg)
    }finally{
      setBusy(false)
    }
  }


  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Automatic report assignement configuration" />
      <Nav tabs>
        <NavItem>
          <NavLink role="button" className={activeTab == 'monthly' ? 'active' : ''} onClick={() => {
            setActiveTab('monthly')
          }}>
            {activeTab == 'monthly' && busy ? <Spinner size="sm" /> : null}  Monthly Report
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink role="button" className={activeTab == 'weekly' ? 'active' : ''} onClick={() => {
            setActiveTab('weekly')
          }}>
            {activeTab == 'weekly' && busy ? <Spinner size="sm" /> : null} Weekly Report
          </NavLink>
        </NavItem>
      </Nav>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Assignment</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => {
              return (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {c.schedule ? (
                        <ButtonGroup size="sm">
                          <Button outline>
                            {c.schedule?.uId?.fullname} - 
                            {getRoleTitle(c.schedule?.uId?.role)}
                          </Button>
                          <Button onClick={() => removeSchedule(c)} outline>
                            <XIcon size='1em' />
                          </Button>
                        </ButtonGroup>
                      ) : <DropdownScheduleUsers
                        customerId={c._id}
                        schedule={c.schedule}
                        onAssigned={loadCustomers}
                        reportType={activeTab}
                      />}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}