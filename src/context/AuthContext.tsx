import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  signUpUser,
  type User,
  type AuthResponse,
} from "../api/authApi";
import apiClient from "../api/client";

interface PremiumStatus {
  isPremium: boolean;
  plan: "free" | "monthly" | "yearly";
  expiresAt: string | null;
  daysLeft: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;

  loading: boolean;
  isError: boolean;
  errMessage: string;
  isSuccess: boolean;
  successMessage: string;

  premiumStatus: PremiumStatus;
  premiumLoading: boolean;
  refreshPremium: () => Promise<void>;

  login: (email: string, password: string) => Promise<boolean>;

  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    acceptTerms: boolean,
    healthDataConsent: boolean
  ) => Promise<boolean>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const clearAuth = () => {
  localStorage.removeItem("herbloomUser");
  localStorage.removeItem("herbloomAccessToken");
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    plan: "free",
    expiresAt: null,
    daysLeft: 0,
  });
  const [premiumLoading, setPremiumLoading] = useState(false);

  // Restore / verify session after refreshing the page
  useEffect(() => {
    const savedUser = localStorage.getItem("herbloomUser");
    const accessToken = localStorage.getItem("herbloomAccessToken");

    if (savedUser && accessToken) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
      } catch {
        clearAuth();
      }
    }

    setAuthLoading(false);
  }, []);

  // Listen for auth:logout events dispatched by the API client 401 interceptor
  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      clearAuth();
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  // LOGIN
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setIsError(false);
      setErrMessage("");
      setIsSuccess(false);
      setSuccessMessage("");

      try {
        const response: AuthResponse = await loginUser(email, password);

        if (response.success && response.data) {
          setUser(response.data.user);
          localStorage.setItem("herbloomUser", JSON.stringify(response.data.user));
          localStorage.setItem("herbloomAccessToken", response.data.accessToken);
          setIsSuccess(true);
          setSuccessMessage(response.message);
          return true;
        }

        setIsError(true);
        setErrMessage(response.message || "Invalid email or password.");
        return false;
      } catch (error) {
        setIsError(true);
        setErrMessage(error instanceof Error ? error.message : "Something went wrong.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // SIGN UP
  const signUp = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      acceptTerms: boolean,
      healthDataConsent: boolean
    ): Promise<boolean> => {
      setLoading(true);
      setIsError(false);
      setErrMessage("");
      setIsSuccess(false);
      setSuccessMessage("");

      try {
        const response: AuthResponse = await signUpUser(
          firstName,
          lastName,
          email,
          password,
          acceptTerms,
          healthDataConsent
        );

        if (response.success && response.data) {
          setUser(response.data.user);
          localStorage.setItem("herbloomUser", JSON.stringify(response.data.user));
          localStorage.setItem("herbloomAccessToken", response.data.accessToken);
          setIsSuccess(true);
          setSuccessMessage(response.message);
          return true;
        }

        setIsError(true);
        setErrMessage(response.message || "Unable to create account.");
        return false;
      } catch (error) {
        setIsError(true);
        setErrMessage(error instanceof Error ? error.message : "Something went wrong.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    setPremiumStatus({ isPremium: false, plan: "free", expiresAt: null, daysLeft: 0 });
    clearAuth();
  }, []);

  const refreshPremium = useCallback(async () => {
    if (!user) return;
    setPremiumLoading(true);
    try {
      const response = await apiClient.get<{
        subscription: { endDate: string | null; plan: string } | null;
        isPremium: boolean;
        daysLeft: number;
        plan: string;
      }>("/payments/subscription");
      const data = response.data.data;
      setPremiumStatus({
        isPremium: data.isPremium,
        plan: data.plan as "free" | "monthly" | "yearly",
        expiresAt: data.subscription?.endDate || null,
        daysLeft: data.daysLeft,
      });
    } catch {
      setPremiumStatus({ isPremium: false, plan: "free", expiresAt: null, daysLeft: 0 });
    } finally {
      setPremiumLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshPremium();
    }
  }, [user, refreshPremium]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    authLoading,

    loading,
    isError,
    errMessage,
    isSuccess,
    successMessage,

    premiumStatus,
    premiumLoading,
    refreshPremium,

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
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}