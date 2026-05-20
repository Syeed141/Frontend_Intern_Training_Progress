"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";

import SearchAndFilterBar, {
  type FilterOption,
} from "../../../../helpers/SearchAndFilterBar";
import { buildUpdatedUrl } from "../../../../helpers/UrlHelpers";
import {
  getControlRoomProductDetails,
  getProductCategoryList,
  getResourceList,
  getResourceTypesByCategory,
  getToolsByCategory,
} from "../../../../services/ControlRoomApi";

import CategoryTabs from "./CategoryTabs";
import ToolsSection from "./ToolsSection";
import ResourceTable from "./ResourceTable";

type ControlRoomClientProps = {
  productId: string;
};

const DEFAULT_PAGE_SIZE = 10;
const RESOURCE_TYPE_LOOKUP_SIZE = 1000;

export default function ControlRoomClient({
  productId,
}: ControlRoomClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;
  const searchQuery = searchParams.get("query") ?? "";

  const selectedToolIds = getListFromUrl(searchParams.get("toolIds"));
  const selectedResourceTypeIds = getListFromUrl(searchParams.get("filterBy"));
  const categoryIdFromUrl = searchParams.get("categoryId") ?? "";

  function updateControlRoomUrl(
    updates: Record<string, string | number | null>,
  ) {
    const nextUrl = buildUpdatedUrl({
      pathname,
      searchParams,
      updates,
    });

    router.push(nextUrl, {
      scroll: false,
    });
  }

  const productDetailsQuery = useQuery({
    queryKey: ["control-room-product-details", productId],
    queryFn: () => getControlRoomProductDetails(productId),
    retry: false,
  });

  // Fetch the category list for this product.
  const categoriesQuery = useQuery({
    queryKey: ["control-room-categories", productId],
    queryFn: () => getProductCategoryList(productId),
    retry: false,
  });

  // updating category

  const categories = categoriesQuery.data ?? [];

  const categoryFromUrlExists = categories.some(
    (category) => category._id === categoryIdFromUrl,
  );
  const activeCategoryId = categoryFromUrlExists
    ? categoryIdFromUrl
    : categories[0]?._id || "";

  const toolsQuery = useQuery({
    queryKey: ["control-room-tools", activeCategoryId, productId],
    queryFn: () =>
      getToolsByCategory({
        categoryId: activeCategoryId,
        productId,
      }),
    enabled: Boolean(activeCategoryId),
    retry: false,
  });

  const resourceTypesQuery = useQuery({
    queryKey: ["control-room-resource-types", activeCategoryId],
    queryFn: () => getResourceTypesByCategory(activeCategoryId),
    enabled: Boolean(activeCategoryId),
    retry: false,
  });

  const productName = productDetailsQuery.data?.name ?? "Product";
  const tools = toolsQuery.data ?? [];
  const resourceTypes = resourceTypesQuery.data ?? [];

  const resourceTypesBySelectedToolsQuery = useQuery({
    queryKey: [
      "control-room-resource-types-by-tools",
      productId,
      activeCategoryId,
      selectedToolIds.join(","),
    ],
    queryFn: () =>
      getResourceList({
        productId,
        categoryId: activeCategoryId,
        toolId: selectedToolIds.join(","),
        page: 1,
        size: RESOURCE_TYPE_LOOKUP_SIZE,
      }),
    enabled: Boolean(activeCategoryId) && selectedToolIds.length > 0,
    retry: false,
  });

  const selectedToolResourceTypeIds = new Set(
    resourceTypesBySelectedToolsQuery.data?.data.map(
      (resource) => resource.typeId,
    ) ?? [],
  );

  const availableResourceTypes =
    selectedToolIds.length === 0
      ? resourceTypes
      : resourceTypes.filter((resourceType) =>
          selectedToolResourceTypeIds.has(resourceType._id),
        );

  const validSelectedResourceTypeIds = selectedResourceTypeIds.filter(
    (typeId) =>
      availableResourceTypes.some(
    (resourceType) => resourceType._id === typeId,
      ),
  );

  const resourceListQuery = useQuery({
    queryKey: [
      "control-room-resources",
      productId,
      activeCategoryId,
      selectedToolIds.join(","),
      validSelectedResourceTypeIds.join(","),
      searchQuery,
      page,
      size,
    ],
    queryFn: () =>
      getResourceList({
        productId,
        categoryId: activeCategoryId,
        toolId: selectedToolIds.join(","),
        filterBy: validSelectedResourceTypeIds.join(","),
        query: searchQuery,
        page,
        size,
      }),
    enabled: Boolean(activeCategoryId),
    retry: false,
  });

  const resources = resourceListQuery.data?.data ?? [];
  const totalResources = resourceListQuery.data?.count ?? 0;
  const isResourceListLoading =
    categoriesQuery.isLoading ||
    (categories.length > 0 && !activeCategoryId) ||
    resourceListQuery.isLoading ||
    resourceListQuery.isFetching;

  const resourceTypeOptions: FilterOption[] = availableResourceTypes.map(
    (resourceType) => ({
      label: resourceType.name,
      value: resourceType._id,
    }),
  );

  function handleCategoryChange(categoryId: string) {
    updateControlRoomUrl({
      categoryId,
      toolIds: null,
      filterBy: null,
      page: 1,
      size,
    });
  }

  function handleToolChange(toolId: string) {
    const nextToolIds = selectedToolIds.includes(toolId)
      ? selectedToolIds.filter((id) => id !== toolId)
      : [...selectedToolIds, toolId];

    updateControlRoomUrl({
      toolIds: getUrlValueFromList(nextToolIds),
      filterBy: null,
      page: 1,
      size,
    });
  }

  function handleSearch(query: string) {
    updateControlRoomUrl({
      query: query.trim(),
      page: 1,
      size,
    });
  }

  function handleFilterChange(nextResourceTypeIds: string[]) {
    updateControlRoomUrl({
      filterBy: getUrlValueFromList(nextResourceTypeIds),
      page: 1,
      size,
    });
  }

  function handlePageChange(nextPage: number) {
    updateControlRoomUrl({
      page: nextPage,
      size,
    });
  }

  // converts url values into array

  function getListFromUrl(value: string | null) {
    return value ? value.split(",").filter(Boolean) : [];
  }

  function getUrlValueFromList(values: string[]) {
    return values.length > 0 ? values.join(",") : null;
  }

  return (
    <div className="control-room-page min-h-screen bg-white px-5 py-6 pt-16 lg:px-8 lg:pt-6">
      <div className="text-xs font-semibold">
        <span className="text-gray-400">Products</span>
        <span className="mx-2 text-gray-300">&gt;</span>
        <span className="text-blue-600">Control Room</span>
      </div>

      {productDetailsQuery.isLoading ? (
        <div className="mt-2 h-8 w-72 animate-pulse rounded bg-gray-100" />
      ) : (
        <h1 className="mt-1 text-2xl font-bold text-gray-800">
          {productName} Control Room
        </h1>
      )}

      <div className="mt-6">
        {categoriesQuery.isLoading ? (
          <ChipPanelSkeleton title="Categories" />
        ) : categoriesQuery.isError ? (
          <p className="text-sm text-red-500">Failed to load categories.</p>
        ) : (
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </div>

      <div className="mt-5">
        <ToolsSection
          tools={tools}
          selectedToolIds={selectedToolIds}
          isLoading={toolsQuery.isLoading}
          onToolChange={handleToolChange}
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-500">Resources</p>

          <div className="flex gap-3">
            <button
              type="button"
              className="rounded bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700"
            >
              Add Bulk
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add Resource
            </button>
          </div>
        </div>
        <SearchAndFilterBar
          searchValue={searchQuery}
          searchPlaceholder="Search by resource name, tool"
          filterValues={validSelectedResourceTypeIds}
          filterPlaceholder="Filter by resource type"
          filterOptions={resourceTypeOptions}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        <ResourceTable
          resources={resources}
          totalItems={totalResources}
          currentPage={page}
          pageSize={size}
          isLoading={isResourceListLoading}
          isError={resourceListQuery.isError}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

function ChipPanelSkeleton({ title }: { title: string }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-500">{title}</p>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-9 w-28 animate-pulse rounded border border-gray-100 bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}
