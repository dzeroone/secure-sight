import { useState } from "react";
import { getLoggedinUser } from "../helpers/api_helper";

export const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const [loading] = useState(userProfileSession ? false : true);
  const [userProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  return { userProfile, loading };
};
