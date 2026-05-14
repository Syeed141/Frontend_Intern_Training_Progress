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

export type DropdownItem = {
  _id: string;
  name: string;
};

type DropdownApiItem = {
  _id?: string;
  id?: string;
  
  name?: string;
  
  rateSheetName?: string;
 
  email?: string;
};

type DropdownApiResponse = {
  data?: DropdownApiItem[] | DropdownApiResponse;
  items?: DropdownApiItem[];
  docs?: DropdownApiItem[];
  results?: DropdownApiItem[];
  list?: DropdownApiItem[];
};

function getDropdownData(responseData: DropdownApiItem[] | DropdownApiResponse) {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }

  if (responseData.data && !Array.isArray(responseData.data)) {
    return getDropdownData(responseData.data);
  }

  return (
    responseData.items ??
    responseData.docs ??
    responseData.results ??
    responseData.list ??
    []
  );
}

function getDropdownName(item: DropdownApiItem) {
  return (
    item.name ||
   
    item.rateSheetName ||[].filter(Boolean).join(" ") ||
    item.email ||
    ""
  );
}

function toDropdownItems(items: DropdownApiItem[]): DropdownItem[] {
  return items.map((item) => ({
    _id: item._id ?? item.id ?? "",
    name: getDropdownName(item),
  }));
}

export async function getCompanyDropdown(): Promise<DropdownItem[]> {
  const response = await axiosInstance.get("/company/list/dropdown");
  
  return toDropdownItems(getDropdownData(response.data));
}

export async function getRateSheetDropdown(): Promise<DropdownItem[]> {
  const response = await axiosInstance.get("/rate-sheet/list/dropdown");
 
  return toDropdownItems(getDropdownData(response.data));
}

export async function getTeamMemberDropdown(): Promise<DropdownItem[]> {
  const response = await axiosInstance.get(
    "/employee/list/active/roleId?roleId=66264e9180fa544bfdd7007a",
  );


  return toDropdownItems(getDropdownData(response.data));
}

export type RateSheetDetails = {
  safeTerms: number;
  valuationCap: number;
  discount: number;
};

type RateSheetDetailsApiResponse = {
  data: RateSheetDetails | { data: RateSheetDetails };
} | RateSheetDetails;

export async function getRateSheetDetails(
  rateSheetId: string,
): Promise<RateSheetDetails> {
  const response = await axiosInstance.get<RateSheetDetailsApiResponse>(
    `/rate-sheet/details/${rateSheetId}`,
  );

  const responseData = response.data;

  if ("safeTerms" in responseData) {
    return responseData;
  }

  if ("data" in responseData && "data" in responseData.data) {
    return responseData.data.data;
  }

  const details = responseData.data;

  if ("safeTerms" in details) {
    return details;
  }

  return details.data;
}

export async function createProduct(body: FormData) {
  const response = await axiosInstance.post("/product/create", body);
  return response.data;
}
