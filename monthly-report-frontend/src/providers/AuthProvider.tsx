"use client";

import { loadAuthUser, setAuthUser } from "@@/helper/helper";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  token: string;
};

interface AuthContextProps {
  currentUser: AuthUser | null;
  loading: boolean;
  setAuth: (data: AuthUser | null, redirect_url?: string) => void;
  signout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  setAuth: () => {},
  signout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const setAuth = useCallback(
    (data: AuthUser | null, redirect_url?: string) => {
      setAuthUser(data);
      setCurrentUser(data);
      if (redirect_url) {
        router.replace(redirect_url);
      }
    },
    [router]
  );

  const signout = useCallback(() => {
    setAuth(null);
    location.replace("/");
  }, [setAuth]);

  const contextValue = useMemo(
    () => ({
      currentUser,
      loading,
      setAuth,
      signout,
    }),
    [currentUser, loading, setAuth, signout]
  );

  useEffect(() => {
    const data = loadAuthUser();
    if (data) {
      setCurrentUser(data as AuthUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
