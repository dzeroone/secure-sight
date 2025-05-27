import { combineReducers, configureStore, UnknownAction } from "@reduxjs/toolkit";
import {
  alcReducer,
  dataReducer,
  apexOneReducer,
  workloadSecurityReducer,
  endpointReducer,
  matchedIcosReducer,
  chartReducer,
  pendingIncidentSummaryReducer,
  incidentSummaryReducer,
  matchSummaryReducer,
  clientReducer,
  tableOfContentsReducer,
  executiveSummaryReducer,
  recommendationReducer,
  deepSecurityReducer,
} from "../features/weekly/weeklySlice";
import sloReducer from "../features/weekly/sloSlice";

const combinedReducer = combineReducers({
  executiveSummary: executiveSummaryReducer,
  recommendation: recommendationReducer,
  alc: alcReducer,
  slo: sloReducer,
  data: dataReducer,
  apexOne: apexOneReducer,
  workloadSecurity: workloadSecurityReducer,
  deepSecurity: deepSecurityReducer,
  endpoint: endpointReducer,
  matchedIcos: matchedIcosReducer,
  chart: chartReducer,
  pendingIncidentSummary: pendingIncidentSummaryReducer,
  incidentSummary: incidentSummaryReducer,
  matchSummary: matchSummaryReducer,
  client: clientReducer,
  tableOfContents: tableOfContentsReducer
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
