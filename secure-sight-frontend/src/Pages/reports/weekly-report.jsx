import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormWeekReport from "../../components/FormWeekReport";
import ModalLoading from "../../components/ModalLoading";
import { getWeeklyReportIndex } from "../../helpers/form_helper";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { ROLES } from "../../data/roles";
import { useProfile } from "../../Hooks/UserHooks";
import WeeklyReportSearch from "../../components/WeeklyReportSearch";
import Error401 from "../Utility/Error401-Page";
import AssignedWeeklyReportList from "../../components/AssignedWeeklyReportList";

const validate = values => {
  const errors = {};

  if (!values.selectedDate) {
    errors.selectedDate = "Selected date cannot be empty"
  }

  if (!values.tenant) {
    errors.tenant = "Tenant cannot be empty"
  }

  return errors
}

const priorityRoles = [ROLES.ADMIN, ROLES.LEVEL3]
const nonPriorityRoles = [ROLES.LEVEL2, ROLES.LEVEL1]

const linkStack = [
  { title: 'Dashbaord', route: '/dashboard' },
  { title: 'Weekly reports', route: '/reports/weekly-report' }
]

export default function WeeklyReport() {
  const { userProfile } = useProfile()

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Weekly reports" linkStack={linkStack} />
      { priorityRoles.includes(userProfile.role) ? (
        <WeeklyReportSearch />
      ) : nonPriorityRoles.includes(userProfile.role) ? (
        <AssignedWeeklyReportList />
      ) : <Error401 /> }
    </div>
  )
}