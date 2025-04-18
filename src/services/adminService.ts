import {
  Admin,
  AdminSearchAndFilterRequest,
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

const adminService = {
  searchAndFilterAdmin,
  exportAdmin,
  getAdminById,
  setIsActiveAdmin,
};

export default adminService;
