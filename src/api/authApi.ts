import apiClient from "./client";
import type { ApiSuccessResponse } from "./client";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;

  profile: {
    avatar: string;
    bio: string;
  };
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData | null;
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;

  profile?: {
    username?: string;
    avatarUrl?: string;
    bio?: string;
  };
}

interface BackendTokens {
  accessToken?: string;
  refreshToken?: string;
}

interface BackendAuthData {
  user: BackendUser;

  /*
   * Different backend responses can use
   * either token/accessToken or tokens.
   */
  token?: string;
  accessToken?: string;
  refreshToken?: string;

  tokens?: BackendTokens;
}

const transformUser = (
  backendUser: BackendUser
): User => {
  const nameParts = backendUser.name
    ? backendUser.name
        .trim()
        .split(/\s+/)
    : ["", ""];

  const firstName =
    nameParts[0] || "";

  const lastName =
    nameParts.length > 1
      ? nameParts.slice(1).join(" ")
      : "";

  return {
    id: backendUser.id,

    firstName,

    lastName,

    email: backendUser.email,

    username:
      backendUser.profile?.username ||
      backendUser.email.split("@")[0],

    role: backendUser.role,

    isVerified:
      backendUser.isVerified,

    profile: {
      avatar:
        backendUser.profile?.avatarUrl ||
        "/images/avatar.png",

      bio:
        backendUser.profile?.bio || "",
    },
  };
};

/*
 * Convert the backend authentication
 * response into the format used by
 * the HerBloom frontend.
 */
const mapResponse = (
  response: ApiSuccessResponse<BackendAuthData>
): AuthResponse => {
  const backendData =
    response.data;

  if (!backendData) {
    return {
      success: response.success,
      message:
        response.message || "",
      data: null,
    };
  }

  const accessToken =
    backendData.tokens?.accessToken ||
    backendData.accessToken ||
    backendData.token ||
    "";

  const refreshToken =
    backendData.tokens?.refreshToken ||
    backendData.refreshToken ||
    "";

  return {
    success: response.success,

    message:
      response.message || "",

    data: {
      user: transformUser(
        backendData.user
      ),

      accessToken,

      refreshToken,
    },
  };
};


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    /*
     * IMPORTANT:
     * The backend response itself has:
     *
     * success
     * message
     * data
     *
     * Therefore the generic must be
     * ApiSuccessResponse<BackendAuthData>.
     */
    const response =
      await apiClient.post<
        ApiSuccessResponse<BackendAuthData>
      >(
        "/users/login",
        {
          email,
          password,
        }
      );

    return mapResponse(
      response.data
    );
  } catch (error: unknown) {
    const message =
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ||
      "Invalid email or password.";

    return {
      success: false,

      message,

      data: null,
    };
  }
};


// =====================================================
// SIGN UP
// =====================================================

export const signUpUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  acceptTerms: boolean,
  healthDataConsent: boolean
): Promise<AuthResponse> => {

  if (
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim()
  ) {
    return {
      success: false,

      message:
        "Please provide all required information.",

      data: null,
    };
  }

  if (!password.trim()) {
    return {
      success: false,

      message:
        "Password is required.",

      data: null,
    };
  }

  if (!acceptTerms) {
    return {
      success: false,

      message:
        "You must accept the terms of service and privacy policy.",

      data: null,
    };
  }

  if (!healthDataConsent) {
    return {
      success: false,

      message:
        "Health data consent is required to create your HerBloom account.",

      data: null,
    };
  }

  try {
    const response =
      await apiClient.post<
        ApiSuccessResponse<BackendAuthData>
      >(
        "/users/register",
        {
          name: `${firstName.trim()} ${lastName.trim()}`,

          email:
            email.trim(),

          password,

          acceptTerms,

          healthDataConsent,
        }
      );

    return mapResponse(
      response.data
    );
  } catch (error: unknown) {
    const message =
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ||
      "Unable to create account.";

    return {
      success: false,

      message,

      data: null,
    };
  }
};