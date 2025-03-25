import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const monthlyPageStateSlice = createSlice({
  name: "monthlyPageState",
  initialState: {
    processing: false,
    auditStatus: -999,
    statusFromServer: 0,
    status: 0,
    reporterId: '',
    isLastReporter: false
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
    setIsLastReporter(state, action: PayloadAction<boolean>) {
      state.isLastReporter = action.payload
    }
  }
})

export const {
  setProcessing,
  setAuditStatus,
  setStatus,
  setStatusFromServer,
  setReporterId,
  setIsLastReporter
} = monthlyPageStateSlice.actions

export default monthlyPageStateSlice.reducer;