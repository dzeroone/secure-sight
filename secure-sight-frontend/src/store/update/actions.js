import { GET_UPDATES, GET_UPDATES_SUCCESS } from "./actionTypes"

export const fetchUpdates = () => {
  return {
    type: GET_UPDATES
  }
}

export const getUpdatesSuccess = data => ({
  type: GET_UPDATES_SUCCESS,
  payload: data,
});