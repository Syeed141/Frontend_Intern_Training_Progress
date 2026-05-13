import axiosInstance from "../lib/axiosInstance";

export async function getDashboardData() {
  const response = await axiosInstance.get("/dashboard");

  return response.data;
}
