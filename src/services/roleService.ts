import axios from "../api/axios";
import {Role, RoleSearchFilter} from "../types/Role";

const roleSearchFilter = ({
  page,
  size ,
  searchKey ,
  isActive,
  sortKey,
  sortBy ,
}: RoleSearchFilter ) => {
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

const roleActive =  (id: string | number, isActive: boolean) => {
  return axios.put("/roles/status", { id, isActive });
};
const editRoles =  (role: Role) => {
  return axios.put("/roles", role);
};
const getPermissions =  () => {
  return axios.get("/permissions");
};

const addRoles =  (role: Role) => {
  return axios.post("/roles", role);
}

const getRoles =  (id: string | number) => {
  return axios.get(`/roles/${id}`);
}
export { roleSearchFilter, roleActive, getPermissions , addRoles, getRoles, editRoles};
