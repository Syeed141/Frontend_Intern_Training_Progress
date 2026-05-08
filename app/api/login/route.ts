import { NextResponse } from "next/server";
import {
  LoginRequestBody,
  LoginSuccessResponse,
  LoginErrorResponse,
  LoginApiResponse,
} from "../../types/auth";

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

    const result = await backendResponse.json();

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

    const successResponse: LoginSuccessResponse = result;

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
