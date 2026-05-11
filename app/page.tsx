"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";

import Button from "./components/button";
import { LoginApiError, loginUser } from "./services/authApi";
import { setCredentials } from "./redux/features/authSlice";

import {
  LoginErrorResponse,
  LoginRequestBody,
  LoginSuccessResponse,
} from "./types/auth";

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

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [credentialError, setCredentialError] =
    useState<LoginErrorResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation<
    LoginSuccessResponse,
    LoginApiError,
    LoginRequestBody
  >({
    mutationFn: loginUser,

    onSuccess: (successResult, submittedData) => {
      const token =
        successResult.accessToken ||
        successResult.token ||
        successResult.access_token;

      if (!token) {
        setCredentialError({
          message: "Login succeeded but token was missing.",
        });
        return;
      }

      dispatch(
        setCredentials({
          user: {
            email:
              successResult.email ||
              successResult.user?.email ||
              submittedData.email,
          },
          token,
        })
      );

      toast.success("Login successful!");
      router.push("/dashboard");
    },

    onError: (error) => {
      setCredentialError(error.response);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setCredentialError(null);

    loginMutation.mutate({
      email: data.email,
      password: data.password,
      grantType: "password",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={180}
          height={180}
          priority
        />
      </div>

      <div className="w-full max-w-md rounded-sm border-t-8 border-blue-600 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        <p className="mt-1 text-gray-400">Continue with pattern50</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          {credentialError && (
            <div className="flex items-center gap-2 rounded-md border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
              <FaExclamationTriangle className="h-5 w-5 shrink-0 text-red-600" />
              <p>{credentialError.message}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full rounded-md border-2 px-4 py-3 outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
              {...register("email")}
            />

            {errors.email && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-600">
                <FaExclamationTriangle className="h-4 w-4 shrink-0" />
                <p>{errors.email.message}</p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full rounded-md border-2 px-4 py-3 pr-12 outline-none ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((isShown) => !isShown)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <div className="mt-1 flex items-center gap-2 text-sm text-red-600">
                <FaExclamationTriangle className="h-4 w-4 shrink-0" />
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

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            fullWidth
          >
            {loginMutation.isPending ? (
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
