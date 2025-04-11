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
  return axios.put("/customers/status", { id, isActive });
};


const getWarranty = async ({
  sortKey,
  customerId,

  page,
  size,
  sortBy,
}) => {
  return axios.post(`/history/warranty`, {
    sortKey,
    filters: {
      customerId,
    },
    page,
    size,
    sortBy,
  });
};

const getPurchase = async ({
  sortKey,
  customerId,

  page,
  size,
  sortBy,
}) => {
  return axios.post(`/history/purchase`, {
    sortKey,
    filters: {
      customerId,
    },
    page,
    size,
    sortBy,
  });
};

const exportPurchase = async (id) => {
  return axios.get(`/export/customers/purchase/${id}`);
};

const exportWarranty = async (id) => {
  return axios.get(`/export/customers/warranty/${id}`);
};

const addWarrantyData = async ({
  customerId,
  carModel,
  licensePlate,
  serviceType,
  serviceCenter,
  serviceDate,
  serviceCost,
}) => {
  return axios.post(`/customers/warranty/${customerId}`, {
    customerId,
    carModel,
    licensePlate,
    serviceType,
    serviceCenter,
    serviceDate,
    serviceCost,
  });
};

export {
  exportApi,
  isActiveApi,
  listCustomer,
  segCustomer,
  getPurchase,
  getWarranty,
  exportPurchase,
  exportWarranty,
  addWarrantyData,
};
