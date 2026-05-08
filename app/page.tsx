"use client";

import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// zod validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  // Custom Form hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");

    //hit
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          grantType: "password",
        }),
      });

      // JSON response receiver
      const result = await response.json();

      if (!response.ok) {
        setLoginError(
          result.message || "credentials you have entered. Please try again.",
        );
        return;
      }

      console.log("Login success:", result);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch {
      setLoginError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={180}
          height={180}
          priority
        />
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-sm border-t-8 border-blue-600 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>

        <p className="mt-1 text-gray-400">Continue with pattern50</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div>
            {/* credentials error */}
            {loginError && (
              <div className="flex gap-2 items-center rounded-md border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700 mb-3">
                <FaExclamationTriangle className=" text-red-600 w-5 h-5 shrink-0" />
                <p>{loginError}</p>
              </div>
            )}

            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full rounded-md border-2 px-4 py-3 outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />
            {/* email error msg */}
            {errors.email && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-600">
                <FaExclamationTriangle className="text-red-600" />

                <p>{errors.email.message}</p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full rounded-md border-2 px-4 py-3 pr-12 outline-none ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
              />
              {/* eye button toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* password error msg */}
            {errors.password && (
              <div className="mt-1 flex items-center gap-2  text-red-600 text-sm">
                <FaExclamationTriangle className="" />

                <p>{errors.password.message}</p>
              </div>
            )}

            <div className="mt-3 text-right">
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
