import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Data Slice for Licenses and Products ---

interface ClientState {
  clientName: string;
}

const initialClientState: ClientState = {
  clientName: "",
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
  },
});

// Export actions and reducer
export const { updateClientName, clearClientName, deleteClientName } =
  clientSlice.actions;
export const clientReducer = clientSlice.reducer;

interface DataState {
  licenses: { Status: string; Product: string }[];
  products: { Status: string; Product: string }[];
  licensesVisible: boolean;
  productsVisible: boolean;
}

const initialDataState: DataState = {
  licenses: [],
  products: [],
  licensesVisible: true,
  productsVisible: true,
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
    { label: "", dataPoint: 0, backgroundColor: "rgba(75,192,192,1)" },
    { label: "", dataPoint: 0, backgroundColor: "rgba(153,102,255,1)" },
    { label: "", dataPoint: 0, backgroundColor: "rgba(255,159,64,1)" },
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

interface ApexOneState {
  latestVersion: number;
  olderVersion: number;
  endOfLife: number;
}

const initialApexOneState: ApexOneState = {
  latestVersion: 0,
  olderVersion: 0,
  endOfLife: 0,
};

const apexOneSlice = createSlice({
  name: "apexOne",
  initialState: initialApexOneState,
  reducers: {
    updateApexOneData: (state, action: PayloadAction<number[]>) => {
      state.latestVersion = action.payload[0];
      state.olderVersion = action.payload[1];
      state.endOfLife = action.payload[2];
    },
  },
});

export const { updateApexOneData } = apexOneSlice.actions;
export const apexOneReducer = apexOneSlice.reducer;
interface WorkloadSecurityState {
  latestVersion: number;
  olderVersion: number;
  endOfLife: number;
}

const initialWorkloadSecurityState: WorkloadSecurityState = {
  latestVersion: 0,
  olderVersion: 0,
  endOfLife: 0,
};

const workloadSecuritySlice = createSlice({
  name: "workloadSecurity",
  initialState: initialWorkloadSecurityState,
  reducers: {
    updateWorkloadSecurityData: (state, action: PayloadAction<number[]>) => {
      state.latestVersion = action.payload[0];
      state.olderVersion = action.payload[1];
      state.endOfLife = action.payload[2];
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
  pendingFromSOC: number[];
  pendingFromCustomer: number[];
}

const initialIncidentSummaryState: IncidentSummaryState = {
  closed: [0, 0, 0, 0],
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
        pendingFromSOC: number[];
        pendingFromCustomer: number[];
      }>
    ) => {
      const { closed, pendingFromSOC, pendingFromCustomer } = action.payload;
      state.closed = closed;
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
export const tisSlice = createCustomSlice("tis");
export const pisSlice = createCustomSlice("pis");
export const epiSlice = createCustomSlice("epi");
export const endPointProtectionSlice = createCustomSlice("endPointProtection");
export const endPointSensorSlice = createCustomSlice("endPointSensor");
export const topIncidentsSlice = createCustomSlice("topIncidents");
export const incidentsSummarySlice = createCustomSlice("incidentsSummary");
export const incidentSummaryStatusSlice = createCustomSlice(
  "incidentSummaryStatus"
);
export const incidentSummarySeveritySlice = createCustomSlice(
  "incidentSummarySeverity"
);

// Export actions and reducers for general slice
export const alcReducer = alcSlice.reducer;
export const tisReducer = tisSlice.reducer;
export const pisReducer = pisSlice.reducer;
export const epiReducer = epiSlice.reducer;
export const endPointProtectionReducer = endPointProtectionSlice.reducer;
export const endPointSensorReducer = endPointSensorSlice.reducer;
export const topIncidentsReducer = topIncidentsSlice.reducer;
export const incidentsSummaryReducer = incidentsSummarySlice.reducer;
export const incidentSummaryStatusReducer = incidentSummaryStatusSlice.reducer;
export const incidentSummarySeverityReducer =
  incidentSummarySeveritySlice.reducer;

export const {
  setKey: setAlcKey,
  addData: addAlcData,
  updateData: updateAlcData,
  removeData: removeAlcData,
} = alcSlice.actions;
export const {
  setKey: setTisKey,
  addData: addTisData,
  updateData: updateTisData,
  removeData: removeTisData,
} = tisSlice.actions;
export const {
  setKey: setPisKey,
  addData: addPisData,
  updateData: updatePisData,
  removeData: removePisData,
} = pisSlice.actions;
export const {
  setKey: setEpiKey,
  addData: addEpiData,
  updateData: updateEpiData,
  removeData: removeEpiData,
} = epiSlice.actions;

export const {
  setKey: setEndPointProtectionKey,
  addData: addEndPointProtectionData,
  updateData: updateEndPointProtectionData,
  removeData: removeEndPointProtectionData,
} = endPointProtectionSlice.actions;

export const {
  setKey: setEndPointSensorKey,
  addData: addEndPointSensorData,
  updateData: updateEndPointSensorData,
  removeData: removeEndPointSensorData,
} = endPointSensorSlice.actions;

export const {
  setKey: setTopIncidentsKey,
  addData: addTopIncidentsData,
  updateData: updateTopIncidentsData,
  removeData: removeTopIncidentsData,
} = topIncidentsSlice.actions;

export const {
  setKey: setIncidentsSummaryKey,
  addData: addIncidentsSummaryData,
  updateData: updateIncidentsSummaryData,
  removeData: removeIncidentsSummaryData,
} = incidentsSummarySlice.actions;

export const {
  setKey: setIncidentSummaryStatusKey,
  addData: addIncidentSummaryStatusData,
  updateData: updateIncidentSummaryStatusData,
  removeData: removeIncidentSummaryStatusData,
} = incidentSummaryStatusSlice.actions;

export const {
  setKey: setIncidentSummarySeverityKey,
  addData: addIncidentSummarySeverityData,
  updateData: updateIncidentSummarySeverityData,
  removeData: removeIncidentSummarySeverityData,
} = incidentSummarySeveritySlice.actions;

// --- Slices with Visibility Control ---

interface VisibilitySliceState {
  key: "Recommendations" | "Notes" | "Summary";
  visible: boolean;
  data: {
    Recommendations: string[];
    Notes: string[];
    Summary: string[];
  };
}

const createVisibilitySlice = (name: string) => {
  const initialState: VisibilitySliceState = {
    key: "Recommendations",
    visible: true,
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
      toggleVisibility: (state) => {
        state.visible = !state.visible;
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

// Create slices with visibility control for different summaries
export const kfdSlice = createVisibilitySlice("kfd");
export const kfwSlice = createVisibilitySlice("kfw");
export const kfaSlice = createVisibilitySlice("kfa");

// Export actions and reducers for visibility-controlled slices
export const kfdReducer = kfdSlice.reducer;
export const kfwReducer = kfwSlice.reducer;
export const kfaReducer = kfaSlice.reducer;

export const {
  setKey: setKfdKey,
  toggleVisibility: toggleKfdVisibility,
  addData: addKfdData,
  updateData: updateKfdData,
  removeData: removeKfdData,
} = kfdSlice.actions;

export const {
  setKey: setKfwKey,
  toggleVisibility: toggleKfwVisibility,
  addData: addKfwData,
  updateData: updateKfwData,
  removeData: removeKfwData,
} = kfwSlice.actions;

export const {
  setKey: setKfaKey,
  toggleVisibility: toggleKfaVisibility,
  addData: addKfaData,
  updateData: updateKfaData,
  removeData: removeKfaData,
} = kfaSlice.actions;
