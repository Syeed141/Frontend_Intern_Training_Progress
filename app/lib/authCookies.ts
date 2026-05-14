import Cookies from "js-cookie";

type PersistedAuth = {
  accessToken?: string | null;
  refreshToken?: string | null;
};

function getPersistedAuth(): PersistedAuth {
  if (typeof window === "undefined") {
    return {};
  }

  const persistedRoot = window.localStorage.getItem("persist:root");

  if (!persistedRoot) {
    return {};
  }

  const root = JSON.parse(persistedRoot) as { auth?: string };

  if (!root.auth) {
    return {};
  }

  return JSON.parse(root.auth) as PersistedAuth;
}

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
  return Cookies.get("accessToken") ?? getPersistedAuth().accessToken;
}

export function getRefreshToken() {
  return Cookies.get("refreshToken") ?? getPersistedAuth().refreshToken;
}
