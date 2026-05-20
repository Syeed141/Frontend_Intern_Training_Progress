"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type FilterOption = {
  label: string;
  value: string;
};

type SearchAndFilterBarProps = {
  searchValue: string;
  searchPlaceholder: string;
  filterValues: string[];
  filterPlaceholder: string;
  filterOptions: FilterOption[];
  onSearch: (query: string) => void;
  onFilterChange: (values: string[]) => void;
};

export default function SearchAndFilterBar({
  searchValue,
  searchPlaceholder,
  filterValues,
  filterPlaceholder,
  filterOptions,
  onSearch,
  onFilterChange,
}: SearchAndFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const selectedOptions = filterOptions.filter((option) =>
    filterValues.includes(option.value),
  );

  const filterButtonLabel =
    selectedOptions.length === 0
      ? filterPlaceholder
      : `${selectedOptions.length} selected`;

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!filterRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isFilterOpen]);

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const query = String(formData.get("query") ?? "");

        onSearch(query);
      }}
    >
      <div className="flex w-full items-center gap-2 border-b border-gray-200 pb-2 text-gray-400 sm:max-w-md">
        <Search className="h-4 w-4" />

        <input
          key={searchValue}
          name="query"
          type="text"
          defaultValue={searchValue}
          placeholder={searchPlaceholder}
          className="w-full text-xs outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700"
        >
          Search
        </button>

        <div ref={filterRef} className="relative w-56">
          <button
            type="button"
            onClick={() => setIsFilterOpen((value) => !value)}
            className={`flex w-full items-center justify-between rounded border bg-white px-4 py-2 text-left text-xs text-gray-500 outline-none ${
              isFilterOpen ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <span className="truncate">{filterButtonLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-10 z-20 max-h-64 w-full overflow-auto rounded border border-gray-200 bg-white py-2 shadow-sm">
              <button
                type="button"
                onClick={() => onFilterChange([])}
                className="block w-full border-b border-gray-100 px-4 py-2 text-left text-xs font-semibold text-blue-600 hover:bg-gray-50"
              >
                Every resource type
              </button>

              {filterOptions.length === 0 ? (
                <p className="px-4 py-2 text-sm text-gray-400">
                  No resource types found.
                </p>
              ) : (
                filterOptions.map((option) => {
                  const isSelected = filterValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const nextValues = isSelected
                          ? filterValues.filter(
                              (value) => value !== option.value,
                            )
                          : [...filterValues, option.value];

                        onFilterChange(nextValues);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300 bg-white text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>

                      <span>{option.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
