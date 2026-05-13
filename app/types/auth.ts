export type LoginRequestBody = {
  email: string;
  password: string;
  grantType: "password";
};

export type LoginSuccessResponse = {
  accessToken: string;
  refreshToken: string;
  authorization: string;
  email: string;
};

export type LoginErrorResponse = {
  message: string;
};

export type AuthUser = {
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  authorization: string | null;
};
