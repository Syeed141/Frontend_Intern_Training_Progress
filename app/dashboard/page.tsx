"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/features/store";

export default function DashboardPage() {

  const { user} = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-6 text-lg">
        Logged in as:
        <span className="font-semibold ml-2">
          {user?.email || "Email not available"}
        </span>
      </p>

      

    </main>
  );
}
