import React from "react";

// Dashboard
import Dashboard from "../Pages/dashboard/page";

// Import Authentication pages
import Logout from "../Pages/Authentication/Logout";
import UserProfile from "../Pages/Authentication/user-profile";

// Import Authentication Inner Pages

// Import Utility Pages
import Error404 from "../Pages/Utility/Error404-Page";
import Error500 from "../Pages/Utility/Error500-Page";
import Maintenance from "../Pages/Utility/Maintenance-Page";

// Import Map Pages
import { createBrowserHistory } from "history";
import { ROLES } from "../data/app";
import AssignMonthlyReportPage from "../Pages/assign/montly-report";
import AssignWeeklyReportPage from "../Pages/assign/weekly-report";
import AssignmentMessagePage from "../Pages/assignments/[id]";
import LoginSSO from "../Pages/Authentication/LoginSSO";
import ConnectorUploader from "../Pages/connector/Connector uploader/connectorUpload";
import ConnectorList from "../Pages/connector/connectorList";
import ConnectorLogFile from "../Pages/connector/connectorLogFile";
import ConnectorSchedule from "../Pages/connector/connectorSchedul";
import CustomerIndexPage from "../Pages/customers";
import DLChangeRequestsPage from "../Pages/customers/dl-change-requests";
import EditCustomerPage from "../Pages/customers/edit";
import NewCustomerPage from "../Pages/customers/new";
import MonthlyReportGraphPage from "../Pages/graphs/monthly-report";
import WeeklyReportGraphPage from "../Pages/graphs/weekly-report";
import MonthlyReport from "../Pages/reports/monthly-report";
import WeeklyReport from "../Pages/reports/weekly-report";
import MonthlySubmissionsPage from "../Pages/submissions/monthly-submissions";
import WeeklySubmissionsPage from "../Pages/submissions/weekly-submissions";
import UserIndexPage from "../Pages/users";
import EditUserPage from "../Pages/users/edit";
import NewUserPage from "../Pages/users/new";

export const history = createBrowserHistory({ window });

const authProtectedRoutes = [
  // Dashboard
  {
    path: "/dashboard", component: <Dashboard />
  },
  { path: "/logout", component: <Logout /> },
  {
    roles: [ROLES.ADMIN],
    path: "/graphs/monthly-report", component: <MonthlyReportGraphPage />
  },
  {
    roles: [ROLES.ADMIN],
    path: "/graphs/weekly-report", component: <WeeklyReportGraphPage />
  },
  {
    roles: [ROLES.ADMIN, ROLES.LEVEL3],
    path: "/users", component: <UserIndexPage />
  },
  {
    roles: [ROLES.ADMIN, ROLES.LEVEL3],
    path: "/users/new", component: <NewUserPage />
  },
  {
    roles: [ROLES.ADMIN, ROLES.LEVEL3],
    path: "/users/:id", component: <EditUserPage />
  },
  // Customers
  {
    roles: [ROLES.ADMIN, ROLES.LEVEL3],
    path: "/customers", component: <CustomerIndexPage />
  },
  {
    roles: [ROLES.ADMIN],
    path: "/customers/new", component: <NewCustomerPage />
  },
  {
    roles: [ROLES.ADMIN, ROLES.LEVEL3],
    path: "/customers/:id", component: <EditCustomerPage />
  },
  {
    roles: [ROLES.ADMIN],
    path: "/customers/:id/dl-change-requests", component: <DLChangeRequestsPage />
  },
  {
    roles: [ROLES.LEVEL3, ROLES.LEVEL2],
    path: "/assign/monthly-report", component: <AssignMonthlyReportPage />
  },
  {
    roles: [ROLES.LEVEL3, ROLES.LEVEL2],
    path: "/assign/weekly-report", component: <AssignWeeklyReportPage />
  },
  {
    roles: [ROLES.LEVEL3, ROLES.LEVEL2, ROLES.LEVEL1],
    path: "/assignments/:id", component: <AssignmentMessagePage />
  },

  // submissions
  {
    roles: [ROLES.LEVEL3, ROLES.LEVEL2],
    path: "/submissions/monthly-report", component: <MonthlySubmissionsPage />
  },
  {
    roles: [ROLES.LEVEL3, ROLES.LEVEL2],
    path: "/submissions/weekly-report", component: <WeeklySubmissionsPage />
  },

  // Report
  {
    roles: ['admin', 'l1', 'l2', 'l3'],
    path: "/reports/monthly-report", component: <MonthlyReport />
  },
  {
    roles: ['admin', 'l1', 'l2', 'l3'],
    path: "/reports/weekly-report", component: <WeeklyReport />
  },

  // Connector
  {
    roles: ['admin'],
    path: "/connector-list", component: <ConnectorList />
  },
  {
    roles: ['admin'],
    path: "/connector-log/:id", component: <ConnectorLogFile />
  },
  {
    roles: ['admin'],
    path: "/connector-schedule", component: <ConnectorSchedule />
  },
  {
    roles: ['admin'],
    path: "/connector-upload", component: <ConnectorUploader />
  },

  // Profile
  { path: "/userprofile", component: <UserProfile /> },
];

const nonAuthRoutes = [
  // Authentication Page
  { path: "/", component: <LoginSSO /> }
];

const publicRoutes = [
  // Utility Pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
];

export { authProtectedRoutes, nonAuthRoutes, publicRoutes };

