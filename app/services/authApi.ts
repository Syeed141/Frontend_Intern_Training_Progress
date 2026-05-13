import axios from "axios";
import {
  LoginErrorResponse,
  LoginRequestBody,
  LoginSuccessResponse,
} from "../types/auth";

export type LoginApiError = {
  response: LoginErrorResponse;
};

function loginError(message: string): LoginApiError {
  return {
    response: {
      message,
    },
  };
}

function isLoginApiError(error: unknown): error is LoginApiError {
  return (
    !!error &&
    typeof error === "object" &&
    "response" in error &&
    !!(error as LoginApiError).response &&
    typeof (error as LoginApiError).response.message === "string"
  );
}

export async function loginUser(
  body: LoginRequestBody,
): Promise<LoginSuccessResponse> {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await axios.post(`${baseUrl}/auth/sign-in`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
    });

    const { auth, user } = response.data;

    if (!auth?.accessToken || !auth?.refreshToken) {
      throw loginError("Login succeeded, but the auth tokens were not returned.");
    }

    return {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      authorization: `Bearer ${auth.accessToken}`,
      email: user?.email || body.email,
    };
  } catch (error) {
    if (isLoginApiError(error)) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw loginError(
        "There is an issue with the credentials you have entered. Please try again.",
      );
    }

    throw error;
  }
}
