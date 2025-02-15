import { configureStore } from '@reduxjs/toolkit';
import monthlyReportReducer from "@@/lib/features/monthly-report/monthlySlice";
import monthlyPageStateReducer from "@@/lib/features/monthly-report/monthlyPageStateSlice";
export const makeStore = () => {
    return configureStore({
        reducer: {
            monthlyReport: monthlyReportReducer,
            monthlyReportPageState: monthlyPageStateReducer
        },
    })
}
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']