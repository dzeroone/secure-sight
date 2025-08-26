import { GET_UPDATES, GET_UPDATES_SUCCESS } from "./actionTypes";

const initialState = {
  fetching: false,
  notifications: [],
  passwordResets: []
}

const Updates = (state = initialState, action) => {
  switch (action.type) {
    case GET_UPDATES_SUCCESS:
      return {
        ...state,
        fetching: false,
        notifications: action.payload.notifications,
        passwordResets: action.payload.passwordResets
      };
    case GET_UPDATES:
      return {
        ...state,
        fetching: true
      }
    default:
      return state
  }
}

export default Updates