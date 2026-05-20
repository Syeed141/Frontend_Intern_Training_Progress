type Nullable<T> = T | null;

export type ProductDetails = {
  _id: string;
  created_by: string;
  name: string;
  details: string;
  clientId: string;
  companyId: string;
  inv_generationDate: Nullable<string>;
  created_at: string;
  updated_at: string;
  __v: number;
  company: {
    _id: string;
    created_by: string;
    name: string;
    email: string;
    masterEmail: string;
    phone: string;
    userId: string;
    ein: string;
    addressId: string;
    clientId: string;
    billingInfoId: string;
    status: string;
    acc_contactId: string;
    created_at: string;
    updated_at: string;
    __v: number;
    isBilling: string;
    studioId: string;
  };
  contract: {
    _id: string;
    created_by: string;
    name: string;
    terminationReason: Nullable<string>;
    safeAgreementAmount: Nullable<number>;
    valuationCapitalAmount: Nullable<number>;
    discount: number;
    clientId: string;
    productId: string;
    rateSheetId: string;
    status: string;
    startDate: string;
    endDate: Nullable<string>;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  ratesheet: {
    _id: string;
    created_by: string;
    name: string;
    startDate: string;
    endDate: Nullable<string>;
    status: string;
    clientId: string;
    created_at: string;
    updated_at: string;
    __v: number;
    roleCount: number;
  };
};

export type ResourceCategory = {
  _id: string;
  name: string;
  image: string;
};

export type ResourceTool = {
  categoryId: string;
  categoryName: string;
  toolId: string;
  toolName: string;
  logo: string;
  toolType: string;
};

export type ResourceType = {
  _id: string;
  name: string;
  description: string;
  category: string;
};

export type ResourceFile = {
  url: string;
  name: string;
  uploadedDate: string;
  fileId: string;
  fileKey: string;
  _id: string;
};

export type LinkedResourceType = {
  _id: string;
  created_by: string;
  name: string;
  description: string;
  resourceCategory: string;
  clientId: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

export type LinkedResourceTool = {
  _id: string;
  created_by: string;
  name: string;
  website: string;
  logo: string;
  logoKey: string;
  logoName: string;
  status: string;
  typeId: string;
  clientId: string;
  created_at: string;
  updated_at: string;
  __v: number;
  type: string;
};

export type ResourceItem = {
  _id: string;
  created_by: string;
  name: string;
  productId: string;
  categoryId: string;
  typeId: string;
  toolId: string;
  toolPurpose: string;
  instruction: string;
  files: ResourceFile[];
  links: unknown[];
  cloudLinks: unknown[];
  cloudFiles: unknown[];
  isDeleted: string;
  clientId: string;
  __v: number;
  created_at: string;
  updated_at: string;
  type: LinkedResourceType;
  tool: LinkedResourceTool;
};

export type ResourceListResponse = {
  data: ResourceItem[];
  count: number;
};

export type ResourceListApiResponse =
  | ResourceListResponse
  | { data: ResourceListResponse };

export type ResourceTypeResponse = {
  types: ResourceType[];
};

export type ApiResponse<T> = T | { data: T | ApiResponse<T> };

export type ResourceTypeApiResponse =
  | ResourceTypeResponse
  | { data: ResourceTypeResponse };

export type GetResourceListParams = {
  page?: number;
  size?: number;
  query?: string;
  categoryId: string;
  filterBy?: string;
  toolId?: string;
  productId: string;
};