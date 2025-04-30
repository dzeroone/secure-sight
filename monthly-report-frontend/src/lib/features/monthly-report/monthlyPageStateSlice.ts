import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  processing: boolean,
  auditStatus: number,
  statusFromServer: number,
  status: number,
  reporterId: string,
  assignment: any,
  canSubmitReport: boolean
}

const initialState: InitialState = {
  processing: false,
  auditStatus: -999,
  statusFromServer: 0,
  status: 0,
  reporterId: '',
  assignment: null,
  canSubmitReport: false
}

const monthlyPageStateSlice = createSlice({
  name: "monthlyPageState",
  initialState,
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
    setAssignment(state, action: PayloadAction<any>) {
      state.assignment = action.payload
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
  setAssignment,
  setCanSubmitReport
} = monthlyPageStateSlice.actions

export default monthlyPageStateSlice.reducer;