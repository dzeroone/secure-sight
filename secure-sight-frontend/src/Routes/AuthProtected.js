import React from "react";
import { Navigate, Route } from "react-router-dom";

import { useProfile } from "../Hooks/UserHooks";
import Error401 from "../Pages/Utility/Error401-Page";

const AuthProtected = (props) => {
  const { userProfile, loading } = useProfile();

  /*
    redirect is un-auth access protected routes via url
    */

  if (!userProfile) {
    return (
      <Navigate to={{ pathname: "/", state: { from: props.location } }} />
    );
  }

  if (Array.isArray(props.roles) && (props.roles.indexOf(userProfile.role) < 0)) {
    return (
      <Error401 />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return <Component {...props} />;
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
