import React, { useEffect, useRef } from "react";
import Routes from "./Routes/index";

// Import Scss
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "./assets/scss/theme.scss";
import { fetchUpdates } from "./store/actions";

function App() {
  const fetching = useSelector(s => s.Updates.fetching)
  const signedIn = useSelector(s => s.login.signedIn)
  const dispatch = useDispatch()
  const notificationTimeoutId = useRef(null)

  useEffect(() => {
    if(!fetching && signedIn) {
      notificationTimeoutId.current = setTimeout(() => {
        dispatch(fetchUpdates())
      }, 5000)
    }

    return () => {
      if (notificationTimeoutId.current) {
        clearTimeout(notificationTimeoutId.current)
      }
    }
  }, [fetching, signedIn])

  return (
    <React.Fragment>
      <Routes />
      <ToastContainer theme="light" autoClose={5000} />
    </React.Fragment>
  );
}
export default App;



