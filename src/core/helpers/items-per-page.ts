export function itemsPerPage(
  page: number,
  totalItemsPerPage = 20,
): [number, number] {
  return [(page - 1) * totalItemsPerPage, page * totalItemsPerPage]
}
