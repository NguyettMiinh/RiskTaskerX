import axios from "@/api/axios";

const exportApi = async ({
  page,
  size = 10,
  searchKey = null,
  tier = null,
  isActive = null,
  sortKey = "id",
  sortBy = "ASC",
}) => {
  const response = await axios.post("/export/customers", {
    sortKey,
    filters: {
      searchKey,
      tier,
      isActive,
    },
    page,
    size,
    sortBy,
  });
  return response.data;
};

//full
const listCustomer = async ({
  page,
  size = 10,
  searchKey = null,
  tier = null,
  isActive = null,
  sortKey = "id",
  sortBy = "ASC",
}) => {
  const response = await axios.post("/customers/full-search-and-filter", {
    sortKey,
    filters: {
      searchKey,
      tier,
      isActive,
    },
    page,
    size,
    sortBy,
  });
  return response.data;
};

const segCustomer = async ({
    page,
    size = 10,
    searchKey = null,
    tier = null,
    isActive = null,
    sortKey = "id",
    sortBy = "ASC",
  }) => {
    const response = await axios.post("/customers/search-and-filter", {
      sortKey,
      filters: {
        searchKey,
        tier,
        isActive,
      },
      page,
      size,
      sortBy,
    });
    return response.data;
  };


const isActiveApi = async (id, isActive) => {
  return axios.put(`/customers/status`, { id, isActive });
};


export { exportApi, isActiveApi, listCustomer, segCustomer };
