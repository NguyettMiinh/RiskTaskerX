import axios from "@/api/axios";

const roleSearchFilter = async ({
  page,
  size = 10,
  searchKey = null,
  isActive = null,
  sortKey = "id",
  sortBy = "ASC",
}) => {
  return axios.post("/roles/search-and-filter", {
    sortKey,
    filters: {
      searchKey,
      isActive,
    },
    page,
    size,
    sortBy,
  });

};

export {
    roleSearchFilter
};
