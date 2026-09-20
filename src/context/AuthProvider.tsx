import {
  useCallback,
  useState,
} from "react";

import {
  loginUser,
  signUpUser,
  type User,
  type AuthResponse,
} from "../api/authApi";

import apiClient from "../api/client";

import {
  AuthContext,
  DEFAULT_PREMIUM_STATUS,
  type AuthProviderProps,
  type PremiumStatus,
} from "./AuthContext";

const clearAuthStorage = () => {
  localStorage.removeItem("herbloomUser");
  localStorage.removeItem(
    "herbloomAccessToken"
  );
  localStorage.removeItem(
    "herbloomRefreshToken"
  );
};

const getSavedUser = (): User | null => {
  const savedUser =
    localStorage.getItem("herbloomUser");

  const accessToken =
    localStorage.getItem(
      "herbloomAccessToken"
    );

  if (!savedUser || !accessToken) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    clearAuthStorage();
    return null;
  }
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  /*
   * Restore saved authentication immediately.
   * No useEffect is needed here.
   */
  const [user, setUser] = useState<User | null>(
    getSavedUser
  );

  const [loading, setLoading] =
    useState(false);

  const [isError, setIsError] =
    useState(false);

  const [errMessage, setErrMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatus>(
      DEFAULT_PREMIUM_STATUS
    );

  const [premiumLoading, setPremiumLoading] =
    useState(false);

  /*
   * PREMIUM
   */
  const refreshPremium = useCallback(
    async () => {
      const accessToken =
        localStorage.getItem(
          "herbloomAccessToken"
        );

      if (!accessToken) {
        setPremiumStatus(
          DEFAULT_PREMIUM_STATUS
        );
        return;
      }

      setPremiumLoading(true);

      try {
        const response =
          await apiClient.get<{
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
          }>(
            "/payment/subscription"
          );

        const data =
          response.data.data;

        if (!data) {
          setPremiumStatus(
            DEFAULT_PREMIUM_STATUS
          );
          return;
        }

        const plan =
          data.plan === "monthly" ||
          data.plan === "yearly"
            ? data.plan
            : "free";

        setPremiumStatus({
          isPremium: Boolean(
            data.isPremium
          ),

          plan,

          expiresAt:
            data.subscription
              ?.endDate || null,

          daysLeft:
            Number(data.daysLeft) || 0,
        });
      } catch {
        /*
         * If the backend is not connected yet,
         * keep the frontend usable.
         */
        setPremiumStatus(
          DEFAULT_PREMIUM_STATUS
        );
      } finally {
        setPremiumLoading(false);
      }
    },
    []
  );

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
          await loginUser(
            email,
            password
          );

        if (
          response.success &&
          response.data
        ) {
          const loggedInUser =
            response.data.user;

          const accessToken =
            response.data.accessToken;

          const refreshToken =
            response.data.refreshToken;

          setUser(loggedInUser);

          localStorage.setItem(
            "herbloomUser",
            JSON.stringify(
              loggedInUser
            )
          );

          localStorage.setItem(
            "herbloomAccessToken",
            accessToken
          );

          if (refreshToken) {
            localStorage.setItem(
              "herbloomRefreshToken",
              refreshToken
            );
          }

          setIsSuccess(true);

          setSuccessMessage(
            response.message ||
              "Login successful."
          );

          /*
           * Premium information is loaded
           * after authentication.
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

        if (
          response.success &&
          response.data
        ) {
          const createdUser =
            response.data.user;

          const accessToken =
            response.data.accessToken;

          const refreshToken =
            response.data.refreshToken;

          setUser(createdUser);

          localStorage.setItem(
            "herbloomUser",
            JSON.stringify(
              createdUser
            )
          );

          localStorage.setItem(
            "herbloomAccessToken",
            accessToken
          );

          if (refreshToken) {
            localStorage.setItem(
              "herbloomRefreshToken",
              refreshToken
            );
          }

          setIsSuccess(true);

          setSuccessMessage(
            response.message ||
              "Account created successfully."
          );

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

    setPremiumStatus(
      DEFAULT_PREMIUM_STATUS
    );

    clearAuthStorage();

    window.dispatchEvent(
      new CustomEvent("auth:logout")
    );
  }, []);

  const value = {
    user,

    isAuthenticated:
      Boolean(user),

    /*
     * Authentication has already been
     * restored synchronously from storage.
     */
    authLoading: false,

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
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}