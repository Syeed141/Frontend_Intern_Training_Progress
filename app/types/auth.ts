export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
  grantType: "password";
};

// with tokens
export type LoginSuccessResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;

  refreshToken?: string;
  refresh_token?: string;

  email?: string;
  user?: {
    email?: string;
  };
};

export type LoginErrorResponse = {
  message: string;
};

export type LoginApiResponse =
  | {
      success: true;
      data: LoginSuccessResponse;
    }
  | {
      success: false;
      error: LoginErrorResponse;
    };

export type AuthUser = {
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

export type ProfileResponse = {
  email: string;
};
