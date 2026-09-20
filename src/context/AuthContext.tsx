import {
  createContext,
  useCallback,
  useContext,
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

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

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

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const DEFAULT_PREMIUM_STATUS: PremiumStatus = {
  isPremium: false,
  plan: "free",
  expiresAt: null,
  daysLeft: 0,
};

const clearAuth = () => {
  localStorage.removeItem("herbloomUser");
  localStorage.removeItem("herbloomAccessToken");
};

const getSavedUser = (): User | null => {
  const savedUser = localStorage.getItem("herbloomUser");
  const accessToken = localStorage.getItem("herbloomAccessToken");

  if (!savedUser || !accessToken) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    clearAuth();
    return null;
  }
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  /*
   * Restore the user immediately when the provider starts.
   * This avoids calling setUser() inside useEffect.
   */
  const [user, setUser] = useState<User | null>(
    getSavedUser
  );

  const [authLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatus>(DEFAULT_PREMIUM_STATUS);

  const [premiumLoading, setPremiumLoading] =
    useState(false);

  /*
   * PREMIUM
   */
  const refreshPremium = useCallback(async () => {
    const savedUser = localStorage.getItem("herbloomUser");
    const accessToken = localStorage.getItem(
      "herbloomAccessToken"
    );

    if (!savedUser || !accessToken) {
      setPremiumStatus(DEFAULT_PREMIUM_STATUS);
      return;
    }

    setPremiumLoading(true);

    try {
      const response = await apiClient.get<{
        success?: boolean;
        data?: {
          subscription?: {
            endDate: string | null;
            plan: string;
          } | null;
          isPremium: boolean;
          daysLeft: number;
          plan: string;
        };
      }>("/payment/subscription");

      const data = response.data.data;

      if (!data) {
        setPremiumStatus(DEFAULT_PREMIUM_STATUS);
        return;
      }

      const plan =
        data.plan === "monthly" ||
        data.plan === "yearly"
          ? data.plan
          : "free";

      setPremiumStatus({
        isPremium: Boolean(data.isPremium),
        plan,
        expiresAt:
          data.subscription?.endDate || null,
        daysLeft: Number(data.daysLeft) || 0,
      });
    } catch {
      setPremiumStatus(DEFAULT_PREMIUM_STATUS);
    } finally {
      setPremiumLoading(false);
    }
  }, []);

  /*
   * LOGIN
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<boolean> => {
      setLoading(true);
      setIsError(false);
      setErrMessage("");
      setIsSuccess(false);
      setSuccessMessage("");

      try {
        const response: AuthResponse =
          await loginUser(email, password);

        if (response.success && response.data) {
          const loggedInUser = response.data.user;
          const accessToken =
            response.data.accessToken;

          setUser(loggedInUser);

          localStorage.setItem(
            "herbloomUser",
            JSON.stringify(loggedInUser)
          );

          localStorage.setItem(
            "herbloomAccessToken",
            accessToken
          );

          setIsSuccess(true);
          setSuccessMessage(
            response.message || "Login successful."
          );

          /*
           * Load premium information after authentication.
           */
          await refreshPremium();

          return true;
        }

        setIsError(true);
        setErrMessage(
          response.message ||
            "Invalid email or password."
        );

        return false;
      } catch (error) {
        setIsError(true);

        setErrMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshPremium]
  );

  /*
   * SIGN UP
   */
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
        const response: AuthResponse =
          await signUpUser(
            firstName,
            lastName,
            email,
            password,
            acceptTerms,
            healthDataConsent
          );

        if (response.success && response.data) {
          const createdUser = response.data.user;
          const accessToken =
            response.data.accessToken;

          setUser(createdUser);

          localStorage.setItem(
            "herbloomUser",
            JSON.stringify(createdUser)
          );

          localStorage.setItem(
            "herbloomAccessToken",
            accessToken
          );

          setIsSuccess(true);
          setSuccessMessage(
            response.message ||
              "Account created successfully."
          );

          /*
           * Load premium information after registration.
           */
          await refreshPremium();

          return true;
        }

        setIsError(true);
        setErrMessage(
          response.message ||
            "Unable to create account."
        );

        return false;
      } catch (error) {
        setIsError(true);

        setErrMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshPremium]
  );

  /*
   * LOGOUT
   */
  const logout = useCallback(() => {
    setUser(null);
    setPremiumStatus(DEFAULT_PREMIUM_STATUS);

    clearAuth();

    /*
     * Let other parts of HerBloom know that
     * authentication has ended.
     */
    window.dispatchEvent(
      new CustomEvent("auth:logout")
    );
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
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
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}