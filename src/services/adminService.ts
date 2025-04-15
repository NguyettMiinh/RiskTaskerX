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

const adminService = {
  searchAndFilterAdmin,
  exportAdmin
};

export default adminService;
