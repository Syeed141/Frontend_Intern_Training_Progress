export function getPaginationPages(
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