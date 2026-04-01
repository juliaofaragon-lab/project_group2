export function getPaginationState(currentPage = 1, itemsPerPage = 8) {
  return {
    currentPage,
    itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  };
}

export function getTotalPages(totalItems = 0, itemsPerPage = 8) {
  return Math.ceil(totalItems / itemsPerPage);
}
