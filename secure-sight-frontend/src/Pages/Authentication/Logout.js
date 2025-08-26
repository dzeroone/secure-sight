import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

import { logoutUser } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();

  const signedIn = useSelector((state) => state.login.signedIn);

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (!signedIn) {
    return <Navigate to="/" />;
  }

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);