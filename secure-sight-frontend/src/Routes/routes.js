import React from "react";

// Dashboard
import Dashboard from "../Pages/Dashboard/index";

// Import Authentication pages
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Login from "../Pages/Authentication/Login";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import UserProfile from "../Pages/Authentication/user-profile";

// Import Authentication Inner Pages
import LockScreen from "../Pages/AuthenticationPages/LockScreen";
import Login1 from "../Pages/AuthenticationPages/Login";
import RecoverPassword from "../Pages/AuthenticationPages/RecoverPassword";
import Register1 from "../Pages/AuthenticationPages/Register";

// Import Utility Pages
import Error404 from "../Pages/Utility/Error404-Page";
import Error500 from "../Pages/Utility/Error500-Page";
import Maintenance from "../Pages/Utility/Maintenance-Page";

// Import Map Pages
import { createBrowserHistory } from "history";
import ConnectorUploader from "../Pages/connector/Connector uploader/connectorUpload";
import ConnectorList from "../Pages/connector/connectorList";
import ConnectorLogFile from "../Pages/connector/connectorLogFile";
import ConnectorSchedule from "../Pages/connector/connectorSchedul";
import CustomerIndexPage from "../Pages/customers";
import EditCustomerPage from "../Pages/customers/edit";
import NewCustomerPage from "../Pages/customers/new";
import AssignMonthlyReportPage from "../Pages/Dashboard/assign/montly-report";
import CreateDashboard from "../Pages/Dashboard/createdashboard";
import DashboardMonthlyReport from "../Pages/Dashboard/monthly-report";
import DashboardWeeklyReport from "../Pages/Dashboard/weekly-report";
import CSVFileView from "../Pages/reports/csvData/csvFileView";
import CSVDataList from "../Pages/reports/csvData/importedDataList";
import MonthlyReport from "../Pages/reports/monthly-report";
import WeeklyReport from "../Pages/reports/weekly-report";
import UserIndexPage from "../Pages/users";
import EditUserPage from "../Pages/users/edit";
import NewUserPage from "../Pages/users/new";
import { ROLES } from "../data/roles";
import AssignWeeklyReportPage from "../Pages/Dashboard/assign/weekly-report";
import MonthlySubmissionsPage from "../Pages/submissions/monthly-submissions";
import WeeklySubmissionsPage from "../Pages/submissions/weekly-submissions";
import AssignmentMessagePage from "../Pages/assignments/[id]";

export const history = createBrowserHistory({ window });

const authProtectedRoutes = [
  // Dashboard
  { path: "/logout", component: <Logout /> },
  {
    roles: ['admin'],
    path: "/dashboard/create-dashboard", component: <CreateDashboard />
  },
  {
    roles: ['admin'],
    path: "/dashboard/monthly-report", component: <DashboardMonthlyReport />
  },
  {
    roles: ['admin'],
    path: "/dashboard/weekly-report", component: <DashboardWeeklyReport />
  },
  {
    path: "/dashboard", component: <Dashboard />
  },
  {
    roles: ['admin'],
    path: "/users", component: <UserIndexPage />
  },
  {
    roles: ['admin'],
    path: "/users/new", component: <NewUserPage />
  },
  {
    roles: ['admin'],
    path: "/users/:id", component: <EditUserPage />
  },
  {
    roles: ['admin'],
    path: "/customers", component: <CustomerIndexPage />
  },
  {
    roles: ['admin'],
    path: "/customers/new", component: <NewCustomerPage />
  },
  {
    roles: ['admin'],
    path: "/customers/:id", component: <EditCustomerPage />
  },
  {
    roles: ['l3', 'l2'],
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

  // CSV
  {
    roles: ['admin'],
    path: "/csv-list", component: <CSVDataList />
  },
  {
    roles: ['admin'],
    path: "/csv-list/:id", component: <CSVFileView />
  }, // Added route for viewing a specific CSV file

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
  { path: "/", component: <Login /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // Authentication Inner Pages
  { path: "/auth-login", component: <Login1 /> },
  { path: "/auth-register", component: <Register1 /> },
  { path: "/auth-recoverpw", component: <RecoverPassword /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
];

const publicRoutes = [
  // Utility Pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
];

export { authProtectedRoutes, nonAuthRoutes, publicRoutes };

