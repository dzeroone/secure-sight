import { put, takeEvery } from "redux-saga/effects";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { getUpdatesSuccess } from "./actions";
import { GET_UPDATES } from "./actionTypes";

function* fetchUpdates() {
  try {
    const response = yield ApiServices(
      "get",
      null,
      ApiEndPoints.Updates
    )
    yield put(getUpdatesSuccess(response))
  } catch (error) {
    // yield put(getEventsFail(error))
  }
}

function* updatesSaga() {
  yield takeEvery(GET_UPDATES, fetchUpdates)
}

export default updatesSaga