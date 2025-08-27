import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Calendar
import calendar from "./calendar/reducer";

// Authentication
import forgetPassword from "./auth/forgetpwd/reducer";
import login from "./auth/login/reducer";
import profile from "./auth/profile/reducer";
import account from "./auth/register/reducer";
import Updates from "./update/reducer";

const appReducer = combineReducers({
  // public
  Layout,
  calendar,
  forgetPassword,
  login,
  profile,
  account,
  Updates
});

const rootReducer = (state, action) => {
  if(action.type == 'RESTORE_LOCAL') {
    return appReducer(action.payload, action)
  }
  return appReducer(state, action)
}

export default rootReducer;
