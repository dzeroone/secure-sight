import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  UPDATE_USER,
} from "./actionTypes";

const initialState = {
  error: "",
  user: null,
  signedIn: false,
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        signedIn: false,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload,
        error: null,
        signedIn: true,
        loading: false,
      };
      break;
    case LOGOUT_USER:
      state = { ...state, user: null, loading: true };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, user: null, signedIn: false, loading: false };
      break;
    case UPDATE_USER:
      state = {...state, user: action.payload}
      break;
    case API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
