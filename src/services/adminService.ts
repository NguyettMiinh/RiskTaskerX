import {
  Admin,
  AdminSearchAndFilterRequest,
  APIResponse,
  PagingResult,
} from "types/Admin";
import axios from "../api/axios";

const searchAndFilterAdmin = async (
  data: AdminSearchAndFilterRequest
): Promise<APIResponse<PagingResult<Admin>>> => {
  const response = await axios.post("/admin/search-and-filter", data);
  return response.data;
};

const adminService = {
  searchAndFilterAdmin,
};

export default adminService;
