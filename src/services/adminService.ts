import {
  Admin,
  AdminAddRequest,
  AdminSearchAndFilterRequest,
  AdminSearchNoPagingRequest,
  AdminUpdateRequest,
  APIResponse,
  APIResponseExport,
  PagingResult,
} from "types/Admin";
import axios from "../api/axios";

const searchAndFilterAdmin = async (
  data: AdminSearchAndFilterRequest
): Promise<APIResponse<PagingResult<Admin>>> => {
  const response = await axios.post("/admin/search-and-filter", data);
  return response.data;
};

const exportAdmin = async (
  data: AdminSearchAndFilterRequest
): Promise<APIResponseExport> => {
  const response = await axios.post("/export/admin", data);
  return response.data;
};
const getAdminById = async (id: number): Promise<APIResponse<Admin>> => {
  const response = await axios.get(`/admin/${id}`);
  return response.data;
};

const setIsActiveAdmin = async (
  id: number,
  isActive: boolean
): Promise<APIResponse<string>> => {
  const response = await axios.post(`/auth/activate/${id}`, { id, isActive });
  return response.data;
};

const updateAdmin = async (
  data: AdminUpdateRequest
): Promise<APIResponse<string>> => {
  const response = await axios.put(`/admin`, data);
  return response.data;
};
const addAdmin = async (
  data: AdminAddRequest
) => {
  const response = await axios.post(`/admin`, data);
  const resData = response.data;
  if (resData.status === "BAD_REQUEST") {
    throw new Error(resData.message);
  }

  return response.data;
};
const getAllAdminNoPaging = async (
  data: AdminSearchNoPagingRequest
): Promise<APIResponse<Admin[]>> => {
  const response = await axios.post(`/admin/search-and-filter/no-paging`, data);
  return response.data;
};

const adminService = {
  searchAndFilterAdmin,
  exportAdmin,
  getAdminById,
  setIsActiveAdmin,
  updateAdmin,
  addAdmin,
  getAllAdminNoPaging
};

export default adminService;
