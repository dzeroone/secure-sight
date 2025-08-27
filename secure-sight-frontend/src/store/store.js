import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import { loadState, saveState } from "../helpers/utils";
import { REDUX_KEY } from "../config";

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState) {

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middlewares)
    ),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

export const store = configureStore(loadState(REDUX_KEY))

store.subscribe(() => saveState(REDUX_KEY, store.getState()));

window.addEventListener('storage', (event) => {
  // Check if the change occurred in localStorage
  if (event.storageArea === localStorage && event.key == REDUX_KEY) {
    store.dispatch({
      type: 'RESTORE_LOCAL',
      payload: JSON.parse(event.newValue)
    })
    // console.log('localStorage item changed:');
    // console.log('Key:', event.key); // The key of the changed item
    // console.log('Old Value:', event.oldValue); // The old value of the item
    // console.log('New Value:', event.newValue); // The new value of the item
    // console.log('URL:', event.url); // The URL of the document that made the change
  }
});
