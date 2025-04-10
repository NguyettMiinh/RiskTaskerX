import axios from "@/api/axios";

const roleSearchFilter = async ({
  page,
  size = 10,
  searchKey = null,
  isActive = null,
  sortKey = "updateAt",
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

const roleActive = async (id, isActive) => {
  return axios.put("/roles/status", { id, isActive });
};

const getPermissions = async () => {
  return axios.get("/permissions");
};

const addRoles = async (name, isActive, permissionId) => {
  return axios.post("/roles", {name, isActive, permissionId});
}
export { roleSearchFilter, roleActive, getPermissions , addRoles};
