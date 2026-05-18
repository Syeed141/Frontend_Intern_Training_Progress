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
  _id?: string;
  name?: string;

  safeTerms?: number;
  valuationCap?: number;
  discount?: number;

  teamStructures?: {
    _id: string;
    employeeRoleId: string;
    internalRate: number;
    billRate: number;

    role?: {
      _id?: string;
      name?: string;
    };
  }[];
};

type RateSheetDetailsApiResponse = {
  data: RateSheetDetails | { data: RateSheetDetails };
} | RateSheetDetails;

function unwrapRateSheetDetails(
  responseData: RateSheetDetailsApiResponse,
): RateSheetDetails {
  if ("data" in responseData) {
    const details = responseData.data;

    if ("data" in details) {
      return details.data;
    }

    return details;
  }

  return responseData;
}

export async function getRateSheetDetails(
  rateSheetId: string,
): Promise<RateSheetDetails> {
  const response = await axiosInstance.get<RateSheetDetailsApiResponse>(
    `/rate-sheet/details/${rateSheetId}`,
  );

  return unwrapRateSheetDetails(response.data);
}

// team members based on the rate sheet
export async function getTeamMemberDropdownByRoleId(
  roleId: string,
): Promise<DropdownItem[]> {
  const response = await axiosInstance.get("/employee/list/active/roleId", {
    params: {
      roleId,
    },
  });

  return toDropdownItems(getDropdownData(response.data));
}
export async function createProduct(body: FormData) {
  const response = await axiosInstance.post("/product/create", body);
  return response.data;
}
