import axiosInstance from "../lib/axiosInstance";


import type {
  ApiResponse,
  GetResourceListParams,
  ProductDetails,
  ResourceCategory,
  ResourceListApiResponse,
  ResourceListResponse,
  ResourceTool,
  ResourceType,
  ResourceTypeApiResponse,
} from "../types/ControlRoomTypes";


// type Nullable<T> = T | null;




// // GET /product/:productId
// export type ProductDetails = {
//   _id: string;
//   created_by: string;
//   name: string;
//   details: string;
//   clientId: string;
//   companyId: string;
//   inv_generationDate: Nullable<string>;
//   created_at: string;
//   updated_at: string;
//   __v: number;
//   company: {
//     _id: string;
//     created_by: string;
//     name: string;
//     email: string;
//     masterEmail: string;
//     phone: string;
//     userId: string;
//     ein: string;
//     addressId: string;
//     clientId: string;
//     billingInfoId: string;
//     status: string;
//     acc_contactId: string;
//     created_at: string;
//     updated_at: string;
//     __v: number;
//     isBilling: string;
//     studioId: string;
//   };
//   contract: {
//     _id: string;
//     created_by: string;
//     name: string;
//     terminationReason: Nullable<string>;
//     safeAgreementAmount: Nullable<number>;
//     valuationCapitalAmount: Nullable<number>;
//     discount: number;
//     clientId: string;
//     productId: string;
//     rateSheetId: string;
//     status: string;
//     startDate: string;
//     endDate: Nullable<string>;
//     created_at: string;
//     updated_at: string;
//     __v: number;
//   };
//   ratesheet: {
//     _id: string;
//     created_by: string;
//     name: string;
//     startDate: string;
//     endDate: Nullable<string>;
//     status: string;
//     clientId: string;
//     created_at: string;
//     updated_at: string;
//     __v: number;
//     roleCount: number;
//   };
// };

// export type ResourceCategory = {
//   _id: string;
//   name: string;
//   image: string;
// };

// export type ResourceTool = {
//   categoryId: string;
//   categoryName: string;
//   toolId: string;
//   toolName: string;
//   logo: string;
//   toolType: string;
// };

// export type ResourceType = {
//   _id: string;
//   name: string;
//   description: string;
//   category: string;
// };

// type ResourceFile = {
//   url: string;
//   name: string;
//   uploadedDate: string;
//   fileId: string;
//   fileKey: string;
//   _id: string;
// };

// type LinkedResourceType = {
//   _id: string;
//   created_by: string;
//   name: string;
//   description: string;
//   resourceCategory: string;
//   clientId: string;
//   created_at: string;
//   updated_at: string;
//   __v: number;
// };

// type LinkedResourceTool = {
//   _id: string;
//   created_by: string;
//   name: string;
//   website: string;
//   logo: string;
//   logoKey: string;
//   logoName: string;
//   status: string;
//   typeId: string;
//   clientId: string;
//   created_at: string;
//   updated_at: string;
//   __v: number;
//   type: string;
// };

// export type ResourceItem = {
//   _id: string;
//   created_by: string;
//   name: string;
//   productId: string;
//   categoryId: string;
//   typeId: string;
//   toolId: string;
//   toolPurpose: string;
//   instruction: string;
//   files: ResourceFile[];
//   links: unknown[];
//   cloudLinks: unknown[];
//   cloudFiles: unknown[];
//   isDeleted: string;
//   clientId: string;
//   __v: number;
//   created_at: string;
//   updated_at: string;
//   type: LinkedResourceType;
//   tool: LinkedResourceTool;
// };

// export type ResourceListResponse = {
//   data: ResourceItem[];
//   count: number;
// };

// type ResourceListApiResponse =
//   | ResourceListResponse
//   | { data: ResourceListResponse };

// type ResourceTypeResponse = {
//   types: ResourceType[];
// };

// type ApiResponse<T> = T | { data: T | ApiResponse<T> };

// type ResourceTypeApiResponse = ResourceTypeResponse | { data: ResourceTypeResponse };

// type GetResourceListParams = {
//   page?: number;
//   size?: number;
//   query?: string;
//   categoryId: string;
//   filterBy?: string;
//   toolId?: string;
//   productId: string;
// };

function unwrapData<T>(responseData: ApiResponse<T>): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return unwrapData(responseData.data as ApiResponse<T>);
  }

  return responseData as T;
}

function unwrapResourceList(
  responseData: ResourceListApiResponse,
): ResourceListResponse {
  if ("count" in responseData) {
    return responseData;
  }

  return responseData.data;
}

export async function getControlRoomProductDetails(
  productId: string,
): Promise<ProductDetails> {
  const response = await axiosInstance.get<ApiResponse<ProductDetails>>(
    `/product/${productId}`,
  );

  return unwrapData(response.data);
}

export async function getProductCategoryList(
  productId: string,
): Promise<ResourceCategory[]> {
  const response = await axiosInstance.get<ApiResponse<ResourceCategory[]>>(
    `/product/category-list/${productId}`,
  );

  return unwrapData(response.data);
}

export async function getToolsByCategory({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}): Promise<ResourceTool[]> {
  const response = await axiosInstance.get<ApiResponse<ResourceTool[]>>(
    "/resource/tools/resource-category",
    {
      params: {
        categoryId,
        productId,
      },
    },
  );

  return unwrapData(response.data);
}

export async function getResourceList({
  page = 1,
  size = 10,
  query = "",
  categoryId,
  filterBy = "",
  toolId = "",
  productId,
}: GetResourceListParams): Promise<ResourceListResponse> {
  const response = await axiosInstance.get<ResourceListApiResponse>(
    "/resource/list",
    {
      params: {
        page,
        size,
        query,
        categoryId,
        filterBy,
        toolId,
        productId,
      },
    },
  );

  return unwrapResourceList(response.data);
}

export async function getResourceTypesByCategory(
  categoryId: string,
): Promise<ResourceType[]> {
  const response = await axiosInstance.get<ResourceTypeApiResponse>(
    "/resource-type/by-category",
    {
      params: {
        categoryId,
      },
    },
  );

  return unwrapData(response.data).types;
}
