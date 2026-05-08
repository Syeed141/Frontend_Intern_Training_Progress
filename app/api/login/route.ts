import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      return NextResponse.json(
        { message: "Missing environment variables" },
        { status: 500 }
      );
    }

    const base64Credentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(`${baseUrl}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify({
        email,
        password,
        grantType: "password",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            "There is an issue with the credentials you have entered. Please try again.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}