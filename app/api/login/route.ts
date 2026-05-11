import { NextResponse } from "next/server";
import {
  LoginRequestBody,
  LoginSuccessResponse,
  LoginErrorResponse,
  LoginApiResponse,
} from "../../types/auth";

const tokenKeys = new Set([
  "accessToken",
  "access_token",
  "token",
  "jwt",
  "jwtToken",
  "bearerToken",
  "idToken",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findStringValue(
  value: unknown,
  keys: Set<string>
): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  for (const [key, fieldValue] of Object.entries(value)) {
    if (keys.has(key) && typeof fieldValue === "string" && fieldValue) {
      return fieldValue;
    }
  }

  for (const fieldValue of Object.values(value)) {
    const nestedValue = findStringValue(fieldValue, keys);

    if (nestedValue) {
      return nestedValue;
    }
  }

  return undefined;
}

export async function POST(request: Request) {
  try {
    const body: LoginRequestBody = await request.json();

    const { email, password, grantType } = body;

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      const errorResponse: LoginErrorResponse = {
        message: "Server configuration is missing.",
      };

      const apiResponse: LoginApiResponse = {
        success: false,
        error: errorResponse,
      };

      return NextResponse.json(apiResponse, { status: 500 });
    }

    const basicAuth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const backendResponse = await fetch(`${baseUrl}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        email,
        password,
        grantType,
      }),
    });

    const result: unknown = await backendResponse.json();

    if (!backendResponse.ok) {
      const errorResponse: LoginErrorResponse = {
        message:
          "There is an issue with the credentials you have entered. Please try again.",
      };

      const apiResponse: LoginApiResponse = {
        success: false,
        error: errorResponse,
      };

      return NextResponse.json(apiResponse, {
        status: backendResponse.status,
      });
    }

    const token = findStringValue(result, tokenKeys);

    if (!token) {
      const errorResponse: LoginErrorResponse = {
        message: "Login succeeded but the server did not return an access token.",
      };

      const apiResponse: LoginApiResponse = {
        success: false,
        error: errorResponse,
      };

      return NextResponse.json(apiResponse, { status: 502 });
    }

    const successResponse: LoginSuccessResponse = {
      accessToken: token,
      email: findStringValue(result, new Set(["email"])),
    };

    const apiResponse: LoginApiResponse = {
      success: true,
      data: successResponse,
    };

    return NextResponse.json(apiResponse, { status: 200 });
  } catch {
    const errorResponse: LoginErrorResponse = {
      message: "Something went wrong. Please try again.",
    };

    const apiResponse: LoginApiResponse = {
      success: false,
      error: errorResponse,
    };

    return NextResponse.json(apiResponse, { status: 500 });
  }
}
