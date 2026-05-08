"use client";

import { LoginFormValues, LoginApiResponse } from "./types/auth";

import Button from "./components/button";
import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/features/authSlice";

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

  const [credentialError, setCredentialError] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setCredentialError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          grantType: "password",
        }),
      });

      const result = (await response.json()) as LoginApiResponse;

      if (!result.success) {
        setCredentialError(result.error.message);
        return;
      }

      const successResult = result.data;

      dispatch(
        setCredentials({
          user: {
            email:
              successResult.email || successResult.user?.email || data.email,
          },
        }),
      );

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch {
      setCredentialError("Something went wrong. Please try again.");
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

      {/* Login Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-sm border-t-8 border-blue-600 p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>

        <p className="mt-1 text-gray-400">Continue with pattern50</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          {/* Top Login Error */}
          {credentialError && (
            <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
              <FaExclamationTriangle className="text-red-600 w-5 h-5 shrink-0" />

              <p>{credentialError}</p>
            </div>
          )}

          {/* Email */}
          <div>
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

            {/* Email Error */}
            {errors.email && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-600">
                <FaExclamationTriangle className="w-4 h-4 shrink-0" />

                <p>{errors.email.message}</p>
              </div>
            )}
          </div>

          {/* Password */}
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

              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Error */}
            {errors.password && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-600">
                <FaExclamationTriangle className="w-4 h-4 shrink-0" />

                <p>{errors.password.message}</p>
              </div>
            )}

            {/* Forgot Password */}
            <div className="mt-3 text-right">
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
