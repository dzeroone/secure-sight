import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from "history";

import { Provider } from "react-redux";
import { Router } from "react-router";
// import "./i18n";

import { configureStore } from "./store/store";
import { history } from './Routes/routes';

const CustomRouter = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configureStore({})}>
    <React.Fragment>
      <CustomRouter history={history}>
        <App />
      </CustomRouter>
    </React.Fragment>
  </Provider>
);
reportWebVitals();
// serviceWorker.unregister();

