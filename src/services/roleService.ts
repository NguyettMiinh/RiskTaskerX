import axios from "../api/axios";
import { Role, RoleSearchFilter } from "../types/Role";

const roleSearchFilter = ({
  page,
  size,
  searchKey,
  isActive,
  sortKey,
  sortBy,
}: RoleSearchFilter) => {
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

const roleActive = (id: string | number, isActive: boolean) => {
  return axios.put("/roles/status", { id, isActive });
};
const editRoles = (id: string| number, name: string, isActive: boolean, permissionId: number[]) => {
  return axios.put("/roles", { id, name, isActive, permissionId });
};
const getPermissions = () => {
  return axios.get("/permissions");
};

const addRoles = (name: string, isActive: boolean, permissionId: number[]) => {
  return axios.post("/roles", {name, isActive, permissionId});
};

const getRoles = (id: string | number) => {
  return axios.get(`/roles/${id}`);
};

const deleteRole = (id: string | number) => {
  return axios.delete(`/roles/${id}`);
};
export {
  roleSearchFilter,
  roleActive,
  getPermissions,
  addRoles,
  getRoles,
  editRoles,
  deleteRole,
};
