"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, PlusCircle, ChevronRight, ChevronDown } from "lucide-react";
import { getProductList } from "@/app/services/productApi";

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



// function getPaginationPages(currentPage: number, totalPages: number) {
//   const pages: Array<number | "..."> = [];

//   if (totalPages <= 7) {
//     for (let page = 1; page <= totalPages; page++) {
//       pages.push(page);
//     }

//     return pages;
//   }

//   pages.push(1);

//   if (currentPage > 3) {
//     pages.push("...");
//   }

//   const startPage = Math.max(2, currentPage - 1);
//   const endPage = Math.min(totalPages - 1, currentPage + 1);

//   for (let page = startPage; page <= endPage; page++) {
//     pages.push(page);
//   }

//   if (currentPage < totalPages - 2) {
//     pages.push("...");
//   }

//   pages.push(totalPages);

//   return pages;
// }


function getPaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export default function ProductsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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
            placeholder="Search by product, company name"
            className="w-full text-xs outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSearchQuery(searchText);
              setPage(1);
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
                {[
                  "all",
                  "draft",
                  "signed",
                  "amended",
                  "terminated",
                  "completed",
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setPage(1);
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
                    onClick={() => setPage(paginationPage)}
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
              onClick={() => setPage((currentPage) => currentPage + 1)}
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