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

// Small delay to simulate an API request
const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

// LOGIN
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  await delay(1000);

  const savedAccount = localStorage.getItem(
    "herbloomAccount"
  );

  let validUser = userData.data.user;
  let validPassword = "HerBloom123";

  // If the user has created an account,
  // use that account for login.
  if (savedAccount) {
    try {
      const account = JSON.parse(savedAccount);

      validUser = account.user;
      validPassword = account.password;
    } catch {
      localStorage.removeItem("herbloomAccount");
    }
  }

  // Check email and password
  if (
    email.trim().toLowerCase() !==
      validUser.email.toLowerCase() ||
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
    data: {
      user: validUser,
      tokens: {
        accessToken:
          "herbloom-access-token",
        refreshToken:
          "herbloom-refresh-token",
      },
    },
  };
};

// SIGN UP
export const signUpUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  await delay(1000);

  if (!password.trim()) {
    return {
      success: false,
      message: "Password is required.",
      data: null,
    };
  }

  const newUser: User = {
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
  };

  // Save the newly created account
  // so it can be used during login.
  localStorage.setItem(
    "herbloomAccount",
    JSON.stringify({
      user: newUser,
      password,
    })
  );

  return {
    success: true,
    message: "Account created successfully",
    data: {
      user: newUser,
      tokens: {
        accessToken:
          "herbloom-signup-access-token",
        refreshToken:
          "herbloom-signup-refresh-token",
      },
    },
  };
};