import axiosInstance from "../lib/axiosInstance";

export type Product = {
  _id: string;
  name: string;
  created_at: string;
  company: {
    name: string;
  };
  contract: {
    status: string;
  };
};

export type ProductListResponse = {
  data: Product[];
  count: number;
};

type GetProductListParams = {
  statusFilter?: string;
  searchQuery?: string;
  page?: number;
  size?: number;
};

export async function getProductList({
  statusFilter = "all",
  searchQuery = "",
  page = 1,
  size = 10,
}: GetProductListParams): Promise<ProductListResponse> {
  const response = await axiosInstance.get<ProductListResponse>("/product/list", {
    params: {
      page,
      size,
      query: searchQuery || undefined,
      filterBy: statusFilter === "all" ? undefined : statusFilter,
    },
  });

  return response.data;
}