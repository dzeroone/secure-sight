import { XIcon } from "lucide-react"
import { Button, ButtonGroup } from "reactstrap"
import { getMonthlyReportIndex, getWeeklyReportIndex } from "../helpers/form_helper"
import { getRoleTitle } from "../helpers/utils"
import DropdownReportAssignment from "./DropdownReportAssignment"

export default function AssignmentInput({
  reportType = 'monthly',
  date,
  scheduledCustomer,
  customer,
  removeAssignment,
  onAssigned,
  onUnAssigned
}) {
  return (
    !scheduledCustomer || (customer.assignments && customer.assignments.length) ? (
      <div className="d-flex flex-wrap gap-1">
        {customer.assignments.map(assignment => {
          return (
            <ButtonGroup size="sm" key={assignment._id}>
              <Button outline>
                {assignment.reporter.fullname} - 
                {getRoleTitle(assignment.reporter.role)}
              </Button>
              <Button onClick={() => removeAssignment(customer, assignment)} outline>
                <XIcon size='1em' />
              </Button>
            </ButtonGroup>
          )
        })}
        <div className="d-inline-flex">
          <DropdownReportAssignment
            key={date}
            date={date}
            index={reportType == 'monthly' ? getMonthlyReportIndex(date, customer.tCode) : getWeeklyReportIndex(date, customer.tCode)}
            customerId={customer._id}
            assignments={customer.assignments}
            onAssigned={onAssigned}
            onUnAssigned={onUnAssigned}
            reportType={reportType}
          />
        </div>
      </div>
    ) : scheduledCustomer ? (
      <div>
        Scheduled for assigning to {scheduledCustomer.schedule.uId.fullname} - {getRoleTitle(scheduledCustomer.schedule.uId.role)}
      </div>
    ) : null
  )
}