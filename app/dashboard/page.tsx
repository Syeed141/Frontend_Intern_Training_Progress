"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/features/store";

export default function DashboardPage() {
  const { user } = useSelector(
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

         
        </div>
      </div>

      
    </main>
  );
}
