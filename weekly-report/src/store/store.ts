import { combineReducers, configureStore, UnknownAction } from "@reduxjs/toolkit";
import sloReducer from "../features/weekly/sloSlice";
import {
  alcReducer,
  apexOneReducer,
  chartReducer,
  clientReducer,
  dataReducer,
  deepSecurityReducer,
  endpointReducer,
  executiveSummaryReducer,
  incidentSummaryReducer,
  matchedIcosReducer,
  matchSummaryReducer,
  pendingIncidentSummaryReducer,
  recommendationReducer,
  tableOfContentsReducer,
  workloadSecurityReducer,
} from "../features/weekly/weeklySlice";

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
    const defaultState = JSON.parse(JSON.stringify(state))
    state =  Object.assign({} , defaultState, action.payload) as RootState;
    // state = action.payload as RootState;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export default store;
