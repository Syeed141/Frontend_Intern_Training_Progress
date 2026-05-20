import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, PencilLine } from "lucide-react";
import Pagination from "@/app/components/common/Pagination";
import { formatShortDate } from "@/app/helpers/dateHelpers";
import type { ResourceItem } from "../../../../types/ControlRoomTypes";

type ResourceTableProps = {
  resources: ResourceItem[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (page: number) => void;
};

export default function ResourceTable({
  resources,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  isError,
  onPageChange,
}: ResourceTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    () => new Set(),
  );

  const visibleResourceIds = useMemo(
    () => resources.map((resource) => resource._id),
    [resources],
  );

  const selectedVisibleCount = visibleResourceIds.filter((resourceId) =>
    selectedResourceIds.has(resourceId),
  ).length;
  const hasVisibleResources = visibleResourceIds.length > 0;
  const isAllVisibleSelected =
    hasVisibleResources && selectedVisibleCount === visibleResourceIds.length;
  const isSomeVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleResourceIds.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeVisibleSelected;
    }
  }, [isSomeVisibleSelected]);

  function handleSelectAllVisible(isChecked: boolean) {
    setSelectedResourceIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);

      visibleResourceIds.forEach((resourceId) => {
        if (isChecked) {
          nextSelectedIds.add(resourceId);
        } else {
          nextSelectedIds.delete(resourceId);
        }
      });

      return nextSelectedIds;
    });
  }

  function handleSelectResource(resourceId: string, isChecked: boolean) {
    setSelectedResourceIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);

      if (isChecked) {
        nextSelectedIds.add(resourceId);
      } else {
        nextSelectedIds.delete(resourceId);
      }

      return nextSelectedIds;
    });
  }

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={isAllVisibleSelected}
                  disabled={!hasVisibleResources || isLoading || isError}
                  onChange={(event) =>
                    handleSelectAllVisible(event.currentTarget.checked)
                  }
                  aria-label="Select all visible resources"
                  className="h-4 w-4 rounded border-gray-200 disabled:cursor-not-allowed"
                />
              </th>
              <th className="px-4 py-3">Resource Name</th>
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Resource Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <>
                {Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-pulse rounded-sm bg-gray-100" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="ml-auto h-4 w-12 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {isError && !isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-red-500"
                >
                  Failed to load resources.
                </td>
              </tr>
            )}

            {!isLoading && !isError && resources.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No resources found.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              resources.map((resource) => (
                <tr key={resource._id} className="border-t border-gray-100">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedResourceIds.has(resource._id)}
                      onChange={(event) =>
                        handleSelectResource(
                          resource._id,
                          event.currentTarget.checked,
                        )
                      }
                      aria-label={`Select ${resource.name}`}
                      className="h-4 w-4 rounded border-gray-200"
                    />
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {resource.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      {resource.tool.logo && (
                        <img
                          src={resource.tool.logo}
                          alt=""
                          className="h-4 w-4 rounded-sm object-contain"
                        />
                      )}

                      <span>{resource.tool.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {resource.type.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {formatShortDate(resource.created_at)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-4 text-gray-500">
                      <button type="button" aria-label="Edit resource">
                        <PencilLine className="h-4 w-4" />
                      </button>

                      <button type="button" aria-label="Open resource">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
        {isLoading ? (
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        ) : (
          <p>
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {resources.length}
            </span>{" "}
            out of{" "}
            <span className="font-semibold text-gray-600">{totalItems}</span>
          </p>
        )}

        {isLoading ? (
          <div className="h-7 w-28 animate-pulse rounded bg-gray-100" />
        ) : (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
