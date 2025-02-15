import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const monthlyPageStateSlice = createSlice({
  name: "monthlyPageState",
  initialState: {
    processing: false
  },
  reducers: {
    setProcessing(state, action: PayloadAction<boolean>) {
      state.processing = action.payload
      return state
    }
  }
})

export const {
  setProcessing
} = monthlyPageStateSlice.actions

export default monthlyPageStateSlice.reducer;