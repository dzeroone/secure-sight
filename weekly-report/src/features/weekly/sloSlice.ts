import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a single SLO data entry
interface SloDataEntry {
  Priority: string;
  Description: string;
  Response_Time: string;
}

// Define the initial state type
interface SloState {
  key: string;
  data: SloDataEntry[];
}

// Initial state with proper typing
const initialState: SloState = {
  key: "Priority",
  data: [],
};

const sloSlice = createSlice({
  name: "slo",
  initialState,
  reducers: {
    // Set the current SLO key (e.g., "Priority", "Description", etc.)
    setSloKey(state, action: PayloadAction<string>) {
      state.key = action.payload;
    },

    // Add new SLO data
    addSloData(state, action: PayloadAction<SloDataEntry>) {
      state.data.push(action.payload);
    },

    // Update specific fields in an SLO data entry
    updateSloData(
      state,
      action: PayloadAction<{
        index: number;
        field: keyof SloDataEntry;
        value: string;
      }>
    ) {
      const { index, field, value } = action.payload;

      // Ensure the index is valid
      if (state.data[index]) {
        state.data[index] = {
          ...state.data[index],
          [field]: value,
        };
      }
    },

    // Remove an SLO data entry by index
    removeSloData(state, action: PayloadAction<number>) {
      state.data.splice(action.payload, 1);
    },
  },
});

// Export actions and reducer
export const { setSloKey, addSloData, updateSloData, removeSloData } =
  sloSlice.actions;
export default sloSlice.reducer;
