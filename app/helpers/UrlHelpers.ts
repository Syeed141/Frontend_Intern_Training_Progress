type QueryValue = string | number | null | undefined;

type BuildUpdatedUrlParams = {
  pathname: string;
  searchParams: {
    toString: () => string;
  };
  updates: Record<string, QueryValue>;
};

export function buildUpdatedUrl({
  pathname,
  searchParams,
  updates,
}: BuildUpdatedUrlParams) {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (value === null || value === "" || value === "all") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}