"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/features/store";

export default function DashboardPage() {
  const { user, accessToken, refreshToken, authorization } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">
          Dashboard
        </h1>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Logged In Email
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-800">
              {user?.email || "No email found"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">Access Token</p>

            <p className="mt-1 break-all text-xs font-semibold text-gray-800">
              {accessToken || "No access token found"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">Refresh Token</p>

            <p className="mt-1 break-all text-xs font-semibold text-gray-800">
              {refreshToken || "No refresh token found"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm text-gray-500">Authorization Bearer Token</p>

            <p className="mt-1 break-all text-xs font-semibold text-gray-800">
              {authorization || "No authorization token found"}
            </p>
          </div>
        </div>
      </div>

      
    </main>
  );
}
