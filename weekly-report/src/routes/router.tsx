import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import {
  DASHBOARD,
  DASHBOARD_SAVED_REPORTS,
  HOME,
} from "../constants/routeConstants";
import Dashboard from "../pages/dashboard/index";
import SavedReportsPage from "../pages/dashboard/saved";

export default function Router() {
  return (
    <Routes>
      <Route path={HOME} element={<Home />} />
      <Route path={DASHBOARD} element={<Dashboard />} />
      <Route path={DASHBOARD_SAVED_REPORTS} element={<SavedReportsPage />} />
    </Routes>
  );
}
