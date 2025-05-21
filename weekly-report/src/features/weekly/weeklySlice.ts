import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _set from 'lodash/set';
import _get from 'lodash/get';

// --- Data Slice for Licenses and Products ---

export type RecommendationNote = {
  key: string;
  data: string[];
};

export interface ClientState {
  clientName: string;
  tenantCode: string;
  subtitle: string;
  title: string;
  dateFrom: string;
  dateTo: string;
}

const initialClientState: ClientState = {
  clientName: "",
  tenantCode: "",
  subtitle: "SOCaaS",
  title: "WEEKLY REPORT",
  dateFrom: "",
  dateTo: ""
};

const clientSlice = createSlice({
  name: "client",
  initialState: initialClientState,
  reducers: {
    updateClientName: (state, action: PayloadAction<string>) => {
      state.clientName = action.payload;
    },
    clearClientName: (state) => {
      state.clientName = "";
    },
    deleteClientName: (state) => {
      state.clientName = "";
    },
    updateClientState(state, action: PayloadAction<{ field: keyof ClientState, value: string }>) {
      state[action.payload.field] = action.payload.value
    }
  },
});

// Export actions and reducer
export const { updateClientName, clearClientName, deleteClientName, updateClientState } =
  clientSlice.actions;
export const clientReducer = clientSlice.reducer;

// Table of Contents
export interface TableIndexInfo {
  title: string
  page: number,
  visible?: boolean
}

const initialTableOfContentsState: TableIndexInfo[] = [{
  title: 'Executive Summary',
  page: 1,
  visible: true 
}, {
  title: 'Threat Intel Summary',
  page: 3,
  visible: true
}, {
  title: 'Indicators of Compromise (IOC) Match Summary',
  page: 3,
  visible: true
}, {
  title: 'Incident Summary by Severity',
  page: 4,
  visible: true
}, {
  title: 'Incident Summary by Status',
  page: 4,
  visible: true
}, {
  title: 'Incidents Summary by Priority',
  page: 5,
  visible: true
}, {
  title: 'Top 10 Incidents Summary by Category',
  page: 5,
  visible: true
}, {
  title: 'Pending Incident Summary',
  page: 6,
  visible: true
}, {
  title: 'SLO Summary',
  page: 7,
  visible: true
}, {
  title: 'Endpoint Inventory',
  page: 8,
  visible: true
}, {
  title: 'Connected Products and License Information',
  page: 8,
  visible: true
}, {
  title: 'Key feature adoption rate of Apex One',
  page: 9,
  visible: true
}, {
  title: 'Key feature adoption rate of Cloud One Workload Security',
  page: 10,
  visible: true
}];

const tableOfContentsSlice = createSlice({
  name: "tableOfContents",
  initialState: initialTableOfContentsState,
  reducers: {
    updateTableOfContents(state, action: PayloadAction<{ attr: string, value: any }>) {
      _set(state, action.payload.attr, action.payload.value)
      // return state.map((s, i) => {
      //   if (i == action.payload.index) {
      //     return {
      //       ...s,
      //       [action.payload.field]: action.payload.value
      //     }
      //   }
      //   return s
      // })
    }
  },
});
export const { updateTableOfContents } =
  tableOfContentsSlice.actions;
export const tableOfContentsReducer = tableOfContentsSlice.reducer;
// End Table of Contents

/**
 * Executive Summary
 */
export interface ExecutiveSummaryState {
  nOfIncidents: number
  riskIndex: number,
  riskContent: string,
  nOfDVul: number,
  nOfICWoAck: number // number of incidents closed without ack
  nOfTIncidents: number, // number of triggered incidents
  iTDate: string // incident trigger date
  epTAgents: number
  epDAgents: number
  epTSensors: number
  epDSensors: number
}
const initialExecutiveSummaryState: ExecutiveSummaryState = {
  nOfIncidents: 0,
  riskIndex: 0,
  riskContent: "The Risk Index is a comprehensive score based on the dynamic assessment of risk factors inclusive of exposure, attack risk, and security configurations risk.",
  nOfDVul: 0,
  nOfICWoAck: 0,
  nOfTIncidents: 0,
  iTDate: '',
  epTAgents: 0,
  epDAgents: 0,
  epTSensors: 0,
  epDSensors: 0
}
const executiveSummarySlice = createSlice({
  name: "executiveSummary",
  initialState: initialExecutiveSummaryState,
  reducers: {
    updateExecutiveSummary(state, action: PayloadAction<{ field: keyof ExecutiveSummaryState, value: any }>) {
      // @ts-ignore
      state[action.payload.field] = action.payload.value
      return state
    }
  },
});
export const { updateExecutiveSummary } =
  executiveSummarySlice.actions;
export const executiveSummaryReducer = executiveSummarySlice.reducer;
// - End Executive summary

/**
 * Reommendation
 */
export interface RecommendationState {
  agentLifeCycle: RecommendationNote[],
  endPointProtection: RecommendationNote[],
  endPointSensor: RecommendationNote[],
  iocMatched: RecommendationNote[],
  iSeverity: RecommendationNote[],
  iStatus: RecommendationNote[],
  iPriority: RecommendationNote[],
  tIByCategory: RecommendationNote[],
  pIncident: RecommendationNote[],
  cIncident: RecommendationNote[], // closed incident summary
  eInventory: RecommendationNote[],
  kFApex: RecommendationNote[],
  kFWorkload: RecommendationNote[],
  kFDeep: RecommendationNote[]
}

const initialRecommendationState: RecommendationState = {
  agentLifeCycle: [],
  endPointProtection: [],
  endPointSensor: [],
  iocMatched: [],
  iSeverity: [],
  iStatus: [],
  iPriority: [],
  tIByCategory: [],
  pIncident: [],
  cIncident: [],
  eInventory: [],
  kFApex: [],
  kFWorkload: [],
  kFDeep: []
}

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState: initialRecommendationState,
  reducers: {
    updateRecommendationProp(state, action: PayloadAction<{ attr: string, value: any }>) {
      _set(state, action.payload.attr, action.payload.value)
    },
    removeRecommendationPropArr(state, action: PayloadAction<{ attr: string, index: number }>) {
      const vArr = _get(state, action.payload.attr)
      if (Array.isArray(vArr)) {
        vArr.splice(action.payload.index, 1)
      }
    }
  }
})

export const { updateRecommendationProp, removeRecommendationPropArr } =
  recommendationSlice.actions;
export const recommendationReducer = recommendationSlice.reducer;

// - End recommendation
interface GraphData {
  label: string
  data: number[],
  backgroundColor?: string | string[]
}

interface DataState {
  licenses: { Status: string; Product: string }[];
  products: { Status: string; Product: string }[];
  licensesVisible: boolean;
  productsVisible: boolean;
  isSeverity: [number, number, number, number] //Incident_Summary_by_Severity,
  isStatus: [number, number, number] // Incident_Summary_by_Status
  t10ISCat: { // T10IS_by_Category
    Key: string[],
    data: GraphData[],
    chart_type: string
  },
  cIncident: { // T10IS_by_Category
    key: string[],
    data: GraphData[]
  },
  sloCV: { // SLO closed volume
    tCI: number, // total closed incidents
    sloMet: number,
    sloNMet: number
  },
  kFARAp: { // Key_feature_adoption_rate_of_Ap
    key: string[],
    data: GraphData[]
  },
  kFARWl: { // Key_feature_adoption_rate_of_Wl
    key: string[],
    data: GraphData[]
  },
  kFARDs: { // Key_feature_adoption_rate_of_Wl
    key: string[],
    data: GraphData[]
  }
}

const initialDataState: DataState = {
  licenses: [],
  products: [],
  licensesVisible: true,
  productsVisible: true,
  isSeverity: [0, 0, 0, 0],
  isStatus: [0, 0, 0],
  t10ISCat: {
    chart_type: 'horizontal_bar',
    Key: [],
    data: []
  },
  cIncident: {
    key: ['Closed as true positive', 'Closed as false positive', 'Closed as remeditate', 'Closed as duplicate'],
    data: [{
      label: 'Closed incidents summary',
      data: [0, 0, 0, 0],
      backgroundColor: ['rgb(255, 130, 0)', 'rgb(255, 230, 0)', 'rgb(255, 230, 130)', 'rgb(255, 230, 230)']
    }]
  },
  sloCV: {
    tCI: 0,
    sloMet: 0,
    sloNMet: 0
  },
  kFARAp: {
    key: [],
    data: []
  },
  kFARWl: {
    key: [],
    data: []
  },
  kFARDs: {
    key: [],
    data: []
  }
};

const dataSlice = createSlice({
  name: "data",
  initialState: initialDataState,
  reducers: {
    // Add License Data
    addLicenseData: (
      state,
      action: PayloadAction<{ Status: string; Product: string }>
    ) => {
      state.licenses.push(action.payload);
    },

    // Add Product Data
    addProductData: (
      state,
      action: PayloadAction<{ Status: string; Product: string }>
    ) => {
      state.products.push(action.payload);
    },

    // Edit License Data
    editLicenseData: (
      state,
      action: PayloadAction<{ index: number; Status: string; Product: string }>
    ) => {
      const { index, Status, Product } = action.payload;
      if (state.licenses[index]) {
        state.licenses[index] = { Status, Product };
      }
    },

    // Edit Product Data
    editProductData: (
      state,
      action: PayloadAction<{ index: number; Status: string; Product: string }>
    ) => {
      const { index, Status, Product } = action.payload;
      if (state.products[index]) {
        state.products[index] = { Status, Product };
      }
    },

    // Remove License Data
    removeLicenseData: (state, action: PayloadAction<number>) => {
      state.licenses.splice(action.payload, 1);
    },

    // Remove Product Data
    removeProductData: (state, action: PayloadAction<number>) => {
      state.products.splice(action.payload, 1);
    },

    // Toggle License Visibility
    toggleLicenseVisibility: (state) => {
      state.licensesVisible = !state.licensesVisible;
    },

    // Toggle Product Visibility
    toggleProductVisibility: (state) => {
      state.productsVisible = !state.productsVisible;
    },
    updateDataProp(state, action: PayloadAction<{ attr: string, value: any }>) {
      _set(state, action.payload.attr, action.payload.value)
    },
    removeDataPropArr(state, action: PayloadAction<{ attr: string, index: number }>) {
      const vArr = _get(state, action.payload.attr)
      if (Array.isArray(vArr)) {
        vArr.splice(action.payload.index, 1)
      }
    }
  },
});

export const {
  addLicenseData,
  addProductData,
  editLicenseData,
  editProductData,
  removeLicenseData,
  removeProductData,
  toggleLicenseVisibility,
  toggleProductVisibility,
  updateDataProp,
  removeDataPropArr
} = dataSlice.actions;

export const dataReducer = dataSlice.reducer;

interface EndpointData {
  endpointName: string;
  detectionsWithSeverity: string;
  actionTakenBySoc: string;
}

interface EndpointState {
  endpointData: EndpointData[];
}

const initialEndpointState: EndpointState = {
  endpointData: [],
};

const endpointSlice = createSlice({
  name: "endpoint",
  initialState: initialEndpointState,
  reducers: {
    addEndpointData: (
      state,
      action: PayloadAction<{
        endpointName: string;
        detectionsWithSeverity: string;
        actionTakenBySoc: string;
      }>
    ) => {
      state.endpointData.push(action.payload);
    },
    editEndpointData: (
      state,
      action: PayloadAction<{
        index: number;
        updatedData: {
          endpointName: string;
          detectionsWithSeverity: string;
          actionTakenBySoc: string;
        };
      }>
    ) => {
      const { index, updatedData } = action.payload;
      if (state.endpointData[index]) {
        state.endpointData[index] = updatedData;
      }
    },
    removeEndpointData: (state, action: PayloadAction<number>) => {
      if (state.endpointData[action.payload]) {
        state.endpointData.splice(action.payload, 1);
      }
    },
  },
});

export const { addEndpointData, editEndpointData, removeEndpointData } =
  endpointSlice.actions;
export const endpointReducer = endpointSlice.reducer;

const initialState = {
  chartData: [
    { label: "XDR feature enabled", dataPoint: 0, backgroundColor: "rgba(75,192,192,1)" },
    { label: "XDR feature not enabled", dataPoint: 0, backgroundColor: "rgba(153,102,255,1)" },
    { label: "Action Required", dataPoint: 0, backgroundColor: "rgba(255,159,64,1)" },
  ],
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    updateChartData: (state, action) => {
      const { index, label, dataPoint } = action.payload;
      if (index >= 0 && index < state.chartData.length) {
        state.chartData[index].label = label;
        state.chartData[index].dataPoint = parseFloat(dataPoint);
      }
    },
    resetChartData: (state) => {
      state.chartData = initialState.chartData;
    },
  },
});

export const { updateChartData, resetChartData } = chartSlice.actions;
export const chartReducer = chartSlice.reducer;

interface MatchedIcosData {
  srNo: number;
  advisoryName: string;
  matchedIocType: string;
  matchedIocDetails: string;
  noOfendpoint: number;
}

interface MatchedIcosState {
  matchedIcosData: MatchedIcosData[];
}

const initialMatchedIcosState: MatchedIcosState = {
  matchedIcosData: [],
};

const matchedIcosSlice = createSlice({
  name: "matchedIcos",
  initialState: initialMatchedIcosState,
  reducers: {
    addMatchedIco: (state, action: PayloadAction<MatchedIcosData>) => {
      state.matchedIcosData.push(action.payload);
    },
    editMatchedIco: (
      state,
      action: PayloadAction<{
        index: number;
        updatedData: MatchedIcosData;
      }>
    ) => {
      const { index, updatedData } = action.payload;
      if (index >= 0 && index < state.matchedIcosData.length) {
        state.matchedIcosData[index] = updatedData;
      }
    },
    removeMatchedIco: (state, action: PayloadAction<number>) => {
      state.matchedIcosData.splice(action.payload, 1);
    },
  },
});

export const { addMatchedIco, editMatchedIco, removeMatchedIco } =
  matchedIcosSlice.actions;
export const matchedIcosReducer = matchedIcosSlice.reducer;

// --- Custom Slice Factory (For Recommendations, Notes, Summary) ---

export interface ApexOneState {
  title: string,
  nsOS: number, // not supported os
  osInc: number, // os agent incompatible
  latestVersion: number;
  olderVersion: number;
  endOfLife: number;
  allV: number;
}

const initialApexOneState: ApexOneState = {
  title: 'Apex One',
  nsOS: 0,
  osInc: 0,
  latestVersion: 0,
  olderVersion: 0,
  endOfLife: 0,
  allV: 0
};

const apexOneSlice = createSlice({
  name: "apexOne",
  initialState: initialApexOneState,
  reducers: {
    updateApexOneData: (state, action: PayloadAction<ApexOneState>) => {
      return action.payload
    }
  },
});

export const { updateApexOneData } = apexOneSlice.actions;
export const apexOneReducer = apexOneSlice.reducer;

export interface WorkloadSecurityState {
  title: string,
  nsOS: number, // not supported os
  osInc: number, // os agent incompatible
  latestVersion: number;
  olderVersion: number;
  endOfLife: number;
  allV: number;
}

const initialWorkloadSecurityState: WorkloadSecurityState = {
  title: 'Workload/Deep Security',
  nsOS: 0,
  osInc: 0,
  latestVersion: 0,
  olderVersion: 0,
  endOfLife: 0,
  allV: 0
};

const workloadSecuritySlice = createSlice({
  name: "workloadSecurity",
  initialState: initialWorkloadSecurityState,
  reducers: {
    updateWorkloadSecurityData: (state, action: PayloadAction<WorkloadSecurityState>) => {
      return action.payload
    },
  },
});

export const { updateWorkloadSecurityData } = workloadSecuritySlice.actions;
export const workloadSecurityReducer = workloadSecuritySlice.reducer;

interface PendingIncidentSummaryState {
  totalPendingIncidents: number;
  customerPendingIncidents: number;
  socTeamPendingIncidents: number;
}

const initialPendingIncidentSummaryState: PendingIncidentSummaryState = {
  totalPendingIncidents: 0,
  customerPendingIncidents: 0,
  socTeamPendingIncidents: 0,
};

const pendingIncidentSummarySlice = createSlice({
  name: "pendingIncidentSummary",
  initialState: initialPendingIncidentSummaryState,
  reducers: {
    updatePendingIncidentSummaryData: (
      state,
      action: PayloadAction<number[]>
    ) => {
      state.totalPendingIncidents = action.payload[0];
      state.customerPendingIncidents = action.payload[1];
      state.socTeamPendingIncidents = action.payload[2];
    },
  },
});

export const { updatePendingIncidentSummaryData } =
  pendingIncidentSummarySlice.actions;
export const pendingIncidentSummaryReducer =
  pendingIncidentSummarySlice.reducer;

interface IncidentSummaryState {
  closed: number[];
  closedWOAck: number[];
  pendingFromSOC: number[];
  pendingFromCustomer: number[];
}

const initialIncidentSummaryState: IncidentSummaryState = {
  closed: [0, 0, 0, 0],
  closedWOAck: [0, 0, 0, 0],
  pendingFromSOC: [0, 0, 0, 0],
  pendingFromCustomer: [0, 0, 0, 0],
};

const incidentSummarySlice = createSlice({
  name: "incidentSummary",
  initialState: initialIncidentSummaryState,
  reducers: {
    updateIncidentSummaryData: (
      state,
      action: PayloadAction<{
        closed: number[];
        closedWOAck: number[];
        pendingFromSOC: number[];
        pendingFromCustomer: number[];
      }>
    ) => {
      const { closed, closedWOAck, pendingFromSOC, pendingFromCustomer } = action.payload;
      state.closed = closed;
      state.closedWOAck = closedWOAck;
      state.pendingFromSOC = pendingFromSOC;
      state.pendingFromCustomer = pendingFromCustomer;
    },
  },
});

export const { updateIncidentSummaryData } = incidentSummarySlice.actions;
export const incidentSummaryReducer = incidentSummarySlice.reducer;

interface MatchSummaryState {
  iocSweeped: number[];
  iocMatched: number[];
  labels: string[];
}

const initialMatchSummaryState: MatchSummaryState = {
  iocSweeped: [0, 0, 0, 0, 0],
  iocMatched: [0, 0, 0, 0, 0],
  labels: ["", "", "", "", ""], // Initialize with empty labels
};

const matchSummarySlice = createSlice({
  name: "matchSummary",
  initialState: initialMatchSummaryState,
  reducers: {
    updateMatchSummaryData: (
      state,
      action: PayloadAction<{
        iocSweeped: number[];
        iocMatched: number[];
        labels: string[];
      }>
    ) => {
      const { iocSweeped, iocMatched, labels } = action.payload;
      state.iocSweeped = iocSweeped;
      state.iocMatched = iocMatched;
      state.labels = labels;
    },
    addChartBar: (state) => {
      state.iocSweeped.push(0);
      state.iocMatched.push(0);
      state.labels.push("");
    },
    removeChartBar: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.iocSweeped.splice(index, 1);
      state.iocMatched.splice(index, 1);
      state.labels.splice(index, 1);
    },
    updateLabel: (
      state,
      action: PayloadAction<{ index: number; label: string }>
    ) => {
      const { index, label } = action.payload;
      state.labels[index] = label;
    },
  },
});

export const {
  updateMatchSummaryData,
  addChartBar,
  removeChartBar,
  updateLabel,
} = matchSummarySlice.actions;
export const matchSummaryReducer = matchSummarySlice.reducer;

interface SliceState {
  key: "Recommendations" | "Notes" | "Summary";
  data: {
    Recommendations: string[];
    Notes: string[];
    Summary: string[];
  };
}

const createCustomSlice = (name: string) => {
  const initialState: SliceState = {
    key: "Recommendations",
    data: {
      Recommendations: [],
      Notes: [],
      Summary: [],
    },
  };

  return createSlice({
    name,
    initialState,
    reducers: {
      setKey: (
        state,
        action: PayloadAction<"Recommendations" | "Notes" | "Summary">
      ) => {
        state.key = action.payload;
      },
      addData: (state, action: PayloadAction<string>) => {
        state.data[state.key].push(action.payload);
      },
      updateData: (
        state,
        action: PayloadAction<{ index: number; text: string }>
      ) => {
        state.data[state.key][action.payload.index] = action.payload.text;
      },
      removeData: (state, action: PayloadAction<number>) => {
        state.data[state.key].splice(action.payload, 1);
      },
    },
  });
};

// Create slices for different summaries (without visibility control)
export const alcSlice = createCustomSlice("alc");
export const endPointSensorSlice = createCustomSlice("endPointSensor");

// Export actions and reducers for general slice
export const alcReducer = alcSlice.reducer;

export const {
  setKey: setAlcKey,
  addData: addAlcData,
  updateData: updateAlcData,
  removeData: removeAlcData,
} = alcSlice.actions;

export const {
  setKey: setEndPointSensorKey,
  addData: addEndPointSensorData,
  updateData: updateEndPointSensorData,
  removeData: removeEndPointSensorData,
} = endPointSensorSlice.actions;
