import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

import { logoutUser } from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.login.user);

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (!user) {
    return <Navigate to="/" />;
  }

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);