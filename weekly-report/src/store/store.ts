import { combineReducers, configureStore, UnknownAction } from "@reduxjs/toolkit";
import {
  alcReducer,
  tisReducer,
  pisReducer,
  epiReducer,
  kfaReducer,
  kfwReducer,
  kfdReducer,
  dataReducer,
  apexOneReducer,
  workloadSecurityReducer,
  endPointProtectionReducer,
  endPointSensorReducer,
  endpointReducer,
  topIncidentsReducer,
  incidentsSummaryReducer,
  incidentSummaryStatusReducer,
  incidentSummarySeverityReducer,
  matchedIcosReducer,
  chartReducer,
  pendingIncidentSummaryReducer,
  incidentSummaryReducer,
  matchSummaryReducer,
  clientReducer,
} from "../features/weekly/weeklySlice";
import sloReducer from "../features/weekly/sloSlice";

const combinedReducer = combineReducers({
  alc: alcReducer,
  tis: tisReducer,
  pis: pisReducer,
  epi: epiReducer,
  endPointProtection: endPointProtectionReducer,
  endPointSensor: endPointSensorReducer,
  kfa: kfaReducer,
  kfw: kfwReducer,
  kfd: kfdReducer,
  slo: sloReducer,
  data: dataReducer,
  apexOne: apexOneReducer,
  workloadSecurity: workloadSecurityReducer,
  endpoint: endpointReducer,
  topIncidents: topIncidentsReducer,
  incidentsSummary: incidentsSummaryReducer,
  incidentSummaryStatus: incidentSummaryStatusReducer,
  incidentSummarySeverity: incidentSummarySeverityReducer,
  matchedIcos: matchedIcosReducer,
  chart: chartReducer,
  pendingIncidentSummary: pendingIncidentSummaryReducer,
  incidentSummary: incidentSummaryReducer,
  matchSummary: matchSummaryReducer,
  client: clientReducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer: typeof combinedReducer = (state, action: UnknownAction) => {
  if (action.type === 'RESET') {
    state = {} as RootState;
  } else if (action.type === 'RESTORE') {
    state = action.payload as RootState;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export default store;
