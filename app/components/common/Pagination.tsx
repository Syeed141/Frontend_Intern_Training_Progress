import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationPages } from "../../helpers/PaginationHelper";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="cursor-pointer rounded p-1 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPaginationPages(currentPage, totalPages).map((page, index) => {
        if (page === "...") {
          return <span key={`ellipsis-${index}`}>...</span>;
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={
              isActive
                ? "cursor-pointer rounded px-1.5 py-1 font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-90"
                : "cursor-pointer rounded px-1.5 py-1 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 active:scale-90"
            }
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="cursor-pointer rounded p-1 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
