import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _set from 'lodash/set';
import _get from 'lodash/get';

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
    updateSloData(state, action: PayloadAction<{ attr: string, value: any }>) {
      _set(state, action.payload.attr, action.payload.value)
    },
    removeSloDataPropArr(state, action: PayloadAction<{ attr: string, index: number }>) {
      const vArr = _get(state, action.payload.attr)
      if (Array.isArray(vArr)) {
        vArr.splice(action.payload.index, 1)
      }
    },

    // Update specific fields in an SLO data entry
    // updateSloData(
    //   state,
    //   action: PayloadAction<{
    //     index: number;
    //     field: keyof SloDataEntry;
    //     value: string;
    //   }>
    // ) {
    //   const { index, field, value } = action.payload;

    //   // Ensure the index is valid
    //   if (state.data[index]) {
    //     state.data[index] = {
    //       ...state.data[index],
    //       [field]: value,
    //     };
    //   }
    // },

    // Remove an SLO data entry by index
    // removeSloData(state, action: PayloadAction<number>) {
    //   state.data.splice(action.payload, 1);
    // },
  },
});

// Export actions and reducer
export const { setSloKey, addSloData, updateSloData, removeSloDataPropArr } =
  sloSlice.actions;
export default sloSlice.reducer;
