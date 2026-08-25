import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import useApi from "../hooks/useApi";
import {
  loginUser,
  signUpUser,
  type User,
  type AuthData,
} from "../api/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isError: boolean;
  errMessage: string;
  isSuccess: boolean;
  successMessage: string;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const {
    loading,
    isError,
    errMessage,
    isSuccess,
    successMessage,
    request,
  } = useApi<AuthData>();

  useEffect(() => {
    const savedUser = localStorage.getItem(
      "herbloomUser"
    );

    const accessToken = localStorage.getItem(
      "herbloomAccessToken"
    );

    if (savedUser && accessToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("herbloomUser");
        localStorage.removeItem("herbloomAccessToken");
        localStorage.removeItem("herbloomRefreshToken");
      }
    }
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<boolean> => {
      const response = await request(() =>
        loginUser(email, password)
      );

      if (
        response?.success &&
        response.data
      ) {
        setUser(response.data.user);

        localStorage.setItem(
          "herbloomUser",
          JSON.stringify(response.data.user)
        );

        localStorage.setItem(
          "herbloomAccessToken",
          response.data.tokens.accessToken
        );

        localStorage.setItem(
          "herbloomRefreshToken",
          response.data.tokens.refreshToken
        );

        return true;
      }

      return false;
    },
    [request]
  );

  const signUp = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ): Promise<boolean> => {
      const response = await request(() =>
        signUpUser(
          firstName,
          lastName,
          email,
          password
        )
      );

      if (
        response?.success &&
        response.data
      ) {
        setUser(response.data.user);

        localStorage.setItem(
          "herbloomUser",
          JSON.stringify(response.data.user)
        );

        localStorage.setItem(
          "herbloomAccessToken",
          response.data.tokens.accessToken
        );

        localStorage.setItem(
          "herbloomRefreshToken",
          response.data.tokens.refreshToken
        );

        return true;
      }

      return false;
    },
    [request]
  );

  const logout = useCallback(() => {
    setUser(null);

    localStorage.removeItem("herbloomUser");
    localStorage.removeItem("herbloomAccessToken");
    localStorage.removeItem("herbloomRefreshToken");
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    isError,
    errMessage,
    isSuccess,
    successMessage,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}