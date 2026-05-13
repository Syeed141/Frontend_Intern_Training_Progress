"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { getProductList } from "@/app/services/productApi";

const STATUS_OPTIONS = [
  "all",
  "draft",
  "signed",
  "amended",
  "terminated",
  "completed",
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusClass(status: string) {
  if (status === "completed") {
    return "bg-green-100 text-green-600";
  }

  if (status === "amended") {
    return "bg-purple-100 text-purple-600";
  }

  if (status === "draft") {
    return "bg-gray-900 text-white";
  }

  return "bg-blue-100 text-blue-600";
}

function getValidPage(value: string | null) {
  const pageNumber = Number(value);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return 1;
  }

  return pageNumber;
}

function getValidSize(value: string | null) {
  const sizeNumber = Number(value);

  if (!Number.isInteger(sizeNumber) || sizeNumber < 1) {
    return 10;
  }

  return sizeNumber;
}

function getValidStatus(value: string | null): StatusFilter {
  if (STATUS_OPTIONS.includes(value as StatusFilter)) {
    return value as StatusFilter;
  }

  return "all";
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  const pages: Array<number | "..."> = [];

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page++) {
      pages.push(page);
    }

    return pages;
  }

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);
    return pages;
  }

  if (currentPage >= totalPages - 2) {
    pages.push(
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );

    return pages;
  }

  pages.push(
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  );

  return pages;
}

function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = getValidPage(searchParams.get("page"));
  const itemsPerPage = getValidSize(searchParams.get("size"));
  const statusFilter = getValidStatus(searchParams.get("filterBy"));
  const searchQuery = searchParams.get("query") ?? "";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState(searchQuery);

  useEffect(() => {
    setSearchText(searchQuery);
  }, [searchQuery]);

  const updateProductUrl = useCallback(
    ({
      nextPage,
      nextSearchQuery,
      nextStatusFilter,
      nextSize,
    }: {
      nextPage?: number;
      nextSearchQuery?: string;
      nextStatusFilter?: StatusFilter;
      nextSize?: number;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", String(nextPage ?? page));
      params.set("size", String(nextSize ?? itemsPerPage));

      if (nextSearchQuery !== undefined) {
        const trimmedQuery = nextSearchQuery.trim();

        if (trimmedQuery) {
          params.set("query", trimmedQuery);
        } else {
          params.delete("query");
        }
      }

      if (nextStatusFilter !== undefined) {
        if (nextStatusFilter === "all") {
          params.delete("filterBy");
        } else {
          params.set("filterBy", nextStatusFilter);
        }
      }

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [itemsPerPage, page, pathname, router, searchParams],
  );

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", statusFilter, searchQuery, page, itemsPerPage],
    queryFn: () =>
      getProductList({
        statusFilter,
        searchQuery,
        page,
        size: itemsPerPage,
      }),
    retry: false,
  });

  const products = productResponse?.data ?? [];
  const totalItems = productResponse?.count ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (searchParams.get("size") !== String(itemsPerPage)) {
      updateProductUrl({
        nextPage: page,
        nextSize: itemsPerPage,
      });

      return;
    }

    if (totalPages === 0 && page !== 1) {
      updateProductUrl({
        nextPage: 1,
      });

      return;
    }

    if (totalPages > 0 && page > totalPages) {
      updateProductUrl({
        nextPage: totalPages,
      });
    }
  }, [isLoading, itemsPerPage, page, searchParams, totalPages, updateProductUrl]);

  if (isLoading) {
    return <p className="p-8 text-sm text-gray-500">Loading products...</p>;
  }

  if (isError) {
    return <p className="p-8 text-sm text-red-500">Failed to load products.</p>;
  }

  return (
    <div className="min-h-screen bg-white px-5 py-6 pt-16 lg:px-8 lg:pt-6">
      <p className="text-xs font-semibold text-blue-600">Products</p>

      <h1 className="mt-1 text-2xl font-bold text-gray-800">All Products</h1>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex w-90 items-center gap-2 border-b border-gray-200 pb-2 text-gray-400">
          <Search className="h-4 w-4" />

          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateProductUrl({
                  nextPage: 1,
                  nextSearchQuery: searchText,
                });
              }
            }}
            placeholder="Search by product, company name"
            className="w-full text-xs outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              updateProductUrl({
                nextPage: 1,
                nextSearchQuery: searchText,
              });
            }}
            className="rounded bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700"
          >
            Search
          </button>

          <div className="relative w-45">
            <button
              type="button"
              onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
              className={`flex w-full items-center justify-between rounded border bg-white px-4 py-2 text-left text-xs text-gray-500 outline-none ${
                isFilterOpen ? "border-blue-500" : "border-gray-200"
              }`}
            >
              {statusFilter === "all" ? "Filter by status" : statusFilter}

              <ChevronDown className="h-4 w-4" />
            </button>

            {isFilterOpen && (
              <div className="absolute left-0 top-10 z-20 w-full rounded border border-gray-200 bg-white py-2 shadow-sm">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      updateProductUrl({
                        nextPage: 1,
                        nextStatusFilter: status,
                      });

                      setIsFilterOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm capitalize text-gray-800 hover:bg-gray-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-xs font-semibold text-white">
            <PlusCircle className="h-4 w-4" />
            Add product
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden border border-gray-50">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="text-[12px] font-bold uppercase text-slate-600">
            <tr className="bg-slate-100">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Created Date</th>
              <th className="px-6 py-3">Contract Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = product.contract.status.toLowerCase();

                return (
                  <tr key={product._id} className="border-t border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.company?.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(product.created_at)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-1 text-[11px] font-semibold ${getStatusClass(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button className="mr-5 text-xs font-medium text-gray-700">
                        Details
                      </button>

                      <button className="text-xs font-semibold text-blue-600">
                        Control room
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
        <p>
          Showing{" "}
          <span className="font-semibold text-gray-600">
            {products.length}
          </span>{" "}
          out of{" "}
          <span className="font-semibold text-gray-600">{totalItems}</span>{" "}
          results
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-4">
            {page > 1 && (
              <button
                type="button"
                onClick={() =>
                  updateProductUrl({
                    nextPage: page - 1,
                  })
                }
                className="text-gray-400 hover:text-blue-600"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {getPaginationPages(page, totalPages).map(
              (paginationPage, index) => {
                if (paginationPage === "...") {
                  return <span key={`ellipsis-${index}`}>...</span>;
                }

                const isActive = paginationPage === page;

                return (
                  <button
                    key={paginationPage}
                    type="button"
                    onClick={() =>
                      updateProductUrl({
                        nextPage: paginationPage,
                      })
                    }
                    className={
                      isActive
                        ? "font-semibold text-blue-600"
                        : "text-gray-400 hover:text-blue-600"
                    }
                  >
                    {paginationPage}
                  </button>
                );
              },
            )}

            <button
              type="button"
              onClick={() =>
                updateProductUrl({
                  nextPage: page + 1,
                })
              }
              disabled={page >= totalPages}
              className="disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-sm text-gray-500">Loading products...</p>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
