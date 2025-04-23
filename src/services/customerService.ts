import axios from "../api/axios";
import { CustomerDetail, GetCustomer, Warranty} from "../types/Customer";

const exportApi =  async({
  page,
  size,
  searchKey,
  tier,
  isActive,
  sortKey ,
  sortBy
}: GetCustomer) => {
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


const getCustomer =  async({
  page,
  size,
  searchKey,
  tier,
  isActive,
  sortKey,
  sortBy,
}: GetCustomer) => {
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

const isActiveApi =  (id: string | number, isActive: boolean ) => {
  return axios.put("/customers/status", { id, isActive });
};


const getWarranty =  ({
  sortKey,
  customerId,
  page,
  size,
  sortBy,
}: CustomerDetail) => {
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

const getPurchase =  ({
  sortKey,
  customerId,
  page,
  size,
  sortBy,
}: CustomerDetail) => {
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

const exportPurchase =  (id: string | number) => {
  return axios.get(`/export/customers/purchase/${id}`);
};

const exportWarranty =  (id: string | number) => {
  return axios.get(`/export/customers/warranty/${id}`);
};

const addWarrantyData =  ({
  customerId,
  carModel,
  licensePlate,
  serviceType,
  serviceCenter,
  serviceDate,
  serviceCost,
}: Warranty) => {
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
const getPayment = (paymentId: string | number) => {
  return axios.get(`history/purchase/${paymentId}`);
}

export {
  getPayment,
  exportApi,
  isActiveApi,
  getCustomer,
  getPurchase,
  getWarranty,
  exportPurchase,
  exportWarranty,
  addWarrantyData,
};
