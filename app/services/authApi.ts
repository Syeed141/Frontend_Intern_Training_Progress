import {
  LoginErrorResponse,
  LoginApiResponse,
  LoginRequestBody,
  LoginSuccessResponse,
} from "../types/auth";

export class LoginApiError extends Error {
  response: LoginErrorResponse;

  constructor(response: LoginErrorResponse) {
    super(response.message);
    this.name = "LoginApiError";
    this.response = response;
  }
}

export async function loginUser(
  body: LoginRequestBody
): Promise<LoginSuccessResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result: LoginApiResponse = await response.json();

  if (!response.ok) {
    throw new LoginApiError(
      result.success ? { message: "Login failed." } : result.error
    );
  }

  if (!result.success) {
    throw new LoginApiError(result.error);
  }

  return result.data;
}
