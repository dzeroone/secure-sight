import { useSelector } from "react-redux";

export const useProfile = () => {
  const userProfile = useSelector(s => s.login.user)
  const loading = useSelector(s => s.login.fetching)

  return { userProfile, loading };
};
