export const parsePaginationParams = (
  page: number | null | undefined = 1,
  size: number | null | undefined,
) => {
  if (page === null || page === undefined || isNaN(page) || page < 0) {
    page = 1;
  }

  if (size === null || size === undefined || isNaN(size)) {
    size = null;
  }

  const offset = size === null ? 0 : (page - 1) * size;

  return {
    page,
    limit: size,
    take: size === null ? undefined : size,
    offset,
  };
};
