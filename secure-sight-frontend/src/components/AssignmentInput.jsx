import { Button, ButtonGroup } from "reactstrap"
import { getRoleTitle } from "../helpers/utils"
import { XIcon } from "lucide-react"
import DropdownReportAssignment from "./DropdownReportAssignment"
import { getMonthlyReportIndex } from "../helpers/form_helper"
import { isPast } from "date-fns"

export default function AssignmentInput({
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
            index={getMonthlyReportIndex(date, customer.tCode)}
            customerId={customer._id}
            assignments={customer.assignments}
            onAssigned={onAssigned}
            onUnAssigned={onUnAssigned}
          />
        </div>
      </div>
    ) : scheduledCustomer && !isPast(date)? (
      <div>
        Scheduled for assigning to {scheduledCustomer.schedule.uId.fullname} - {getRoleTitle(scheduledCustomer.schedule.uId.role)}
      </div>
    ) : null
  )
}