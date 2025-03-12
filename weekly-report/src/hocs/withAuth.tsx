import { ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const withAuth = (WrappedComponent: ComponentType) => {
  return function WithAuth(props: any) {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) return null;
    if (!currentUser) {
      const redirectUrl = `/?redirect_url=${encodeURIComponent(
        location.pathname + location.search
      )}`;
      navigate(redirectUrl, {
        replace: true,
      });
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
