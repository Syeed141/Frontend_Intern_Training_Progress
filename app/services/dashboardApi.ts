import { ProfileResponse } from "../types/auth";

export async function getProfile(token: string): Promise<ProfileResponse> {
  const response = await fetch("/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the required profile");
  }

  return response.json();
}