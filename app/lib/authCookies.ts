import Cookies from "js-cookie";

export function saveAuthTokens(
  accessToken: string,
  refreshToken: string
) 
{
  Cookies.set("accessToken", accessToken, {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  Cookies.set("refreshToken", refreshToken, {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function getAccessToken() {
  return Cookies.get("accessToken");
}

export function getRefreshToken() {
  return Cookies.get("refreshToken");
}
