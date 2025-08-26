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
