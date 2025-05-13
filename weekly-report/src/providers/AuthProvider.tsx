import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

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
  const router = useNavigate();

  const setAuth = useCallback(
    (data: AuthUser | null, redirect_url?: string) => {
      if (data) localStorage.setItem("authUser", JSON.stringify(data));
      else localStorage.removeItem("authUser");
      setCurrentUser(data);
      if (redirect_url) {
        router(redirect_url, {
          replace: true,
        });
      }
    },
    [router]
  );

  const signout = useCallback(() => {
    setAuth(null);
    window.location.replace("/");
  }, [setAuth, router]);

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
    const data = localStorage.getItem("authUser");
    if (data) {
      setCurrentUser(JSON.parse(data) as AuthUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
