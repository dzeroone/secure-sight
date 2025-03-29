import AssignedMonthlyReportList from "../../components/AssignedMontlyReportList";
import MonthlyReportSearch from "../../components/MonthlyReportSearch";
import { ROLES } from '../../data/app';
import { useProfile } from '../../Hooks/UserHooks';
import Error401 from "../Utility/Error401-Page";
import BreadcrumbWithTitle from '../../components/Common/BreadcrumbWithTitle';

const priorityRoles = [ROLES.ADMIN, ROLES.LEVEL3]
const nonPriorityRoles = [ROLES.LEVEL2, ROLES.LEVEL1]

const linkStack = [
  { title: 'Dashbaord', route: '/dashboard' },
  { title: 'Monthly reports', route: '/reports/monthly-report' }
]

export default function MonthlyReport() {
  const { userProfile } = useProfile()

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Monthly reports" linkStack={linkStack} />
      { priorityRoles.includes(userProfile.role) ? (
        <MonthlyReportSearch />
      ) : nonPriorityRoles.includes(userProfile.role) ? (
        <AssignedMonthlyReportList />
      ) : <Error401 /> }
    </div>
  )
}