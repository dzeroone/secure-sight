import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const monthlyPageStateSlice = createSlice({
  name: "monthlyPageState",
  initialState: {
    processing: false,
    auditStatus: -999,
    statusFromServer: 0,
    status: 0,
    reporterId: '',
    canSubmitReport: false
  },
  reducers: {
    setProcessing(state, action: PayloadAction<boolean>) {
      state.processing = action.payload
      return state
    },
    setStatus(state, action: PayloadAction<number>) {
      state.status = action.payload
    },
    setStatusFromServer(state, action: PayloadAction<number>) {
      state.statusFromServer = action.payload
    },
    setAuditStatus(state, action: PayloadAction<number>) {
      state.auditStatus = action.payload
    },
    setReporterId(state, action: PayloadAction<string>) {
      state.reporterId = action.payload
    },
    setCanSubmitReport(state, action: PayloadAction<boolean>) {
      state.canSubmitReport = action.payload
    }
  }
})

export const {
  setProcessing,
  setAuditStatus,
  setStatus,
  setStatusFromServer,
  setReporterId,
  setCanSubmitReport
} = monthlyPageStateSlice.actions

export default monthlyPageStateSlice.reducer;