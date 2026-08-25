import userData from "./json/user.json";

export interface User {
  id: number;
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
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData | null;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  const validEmail = userData.data.user.email;
  const validPassword = "HerBloom123";

  if (
    email.trim().toLowerCase() !==
      validEmail.toLowerCase() ||
    password !== validPassword
  ) {
    return {
      success: false,
      message: "Invalid email or password.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Login successful",
    data: userData.data,
  };
};

export const signUpUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  if (!password.trim()) {
    return {
      success: false,
      message: "Password is required.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Account created successfully",
    data: {
      user: {
        id: 2,
        firstName,
        lastName,
        email,
        username: email.split("@")[0],
        role: "user",
        isVerified: true,
        profile: {
          avatar: "/images/avatar.png",
          bio: "HerBloom community member",
        },
      },
      tokens: {
        accessToken: "herbloom-signup-access-token",
        refreshToken: "herbloom-signup-refresh-token",
      },
    },
  };
};