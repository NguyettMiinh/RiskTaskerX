// Import thư viện ngoài
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// Import nội bộ
import { Role, RoleForm, RoleTable } from "../../../../types/Role";
import { roleSearchFilter, roleActive } from "../../../../services/roleService";
import { showConfirmModal } from "../../../../utils/showConfimModal";
import { formatTime } from "../../../../utils/formatTime";
import { setId } from "../../../../redux/userSlice";

function useRole() {
  //mang ca doi tuong role
  const [roles, setRoles] = useState<Role[]>([]);
  const [originalRoles, setOriginalRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const dataSource: RoleTable[]  = roles?.map((item) => ({ ...item, key: item.id }));
  const [formData, setFormData] = useState<RoleForm>({
    search: "",
    status: [],
    sortField: "",
    sortOrder: "ASC",
    pageSize: 10,
    totalRoles: 0,
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search, status, sortField, sortOrder, pageSize} =
    formData;
    
  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage, search, status, pageSize, sortField, sortOrder]);

  const fetchRoles = async (page: number) => {
    try {
      const response = await roleSearchFilter({
        sortKey: sortField,
        sortBy: sortOrder,
        searchKey: search,
        isActive: status,
        page: page,
        size: pageSize,
      });
      // cấu trúc ko xác định rõ
      const results = response.data.results;
      const newResult = results?.content.map((item: Role) => ({
        ...item,
        updateAt: formatTime(item.updateAt),
      }));

      setRoles(newResult);
      setOriginalRoles(newResult);
      setFormData({
        ...formData,
        totalRoles: results.totalElements,
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    
  };


  const viewDetails = (id: string | number) => {
    dispatch(setId(id));
    setTimeout(() => {
      navigate("/layout/role-list/role-detail");
    }, 100);
  };
  const updateRoleStatus = (id: string | number, isActive: boolean) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.id === id ? { ...role, isActive } : role))
    );
  };
  const handleApiUpdate = async (id: string | number, isActive: boolean) => {
    try {
      const response = await roleActive(id, isActive);
      if (!response) {
        updateRoleStatus(id, !isActive);
      }
      console.log("....render2");
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateRoleStatus(id, !isActive);
    }
    
  };
  // put isActive
  const toggleActive = (id: string | number, isActive: boolean) => {
    showConfirmModal(
      isActive,
      async () => {
        updateRoleStatus(id, isActive);
        await handleApiUpdate(id, isActive);
        if (isActive) {
          toast.success("Role successfully activated");
        } else {
          toast.success("Role successfully deactivated");
        }
      },
      "role"
    );
  };


  //sort
  const handleTable = (pagination: any, filters: any, sorter: any) => {
    if (sorter.order) {
      setFormData({
        ...formData,
        sortField: sorter.field,
        sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setFormData({ ...formData, sortField: "", sortOrder: "ASC" });
    }
  };
  /// search customer
  const searchHandle = (value: string) => {
    setFormData({ ...formData, search: value });
    setCurrentPage(0);
  };
  //status filter
  const statusHandle = (value: boolean[]) => {
    setFormData({ ...formData, status: value });
    setCurrentPage(0);
  };
  // onChange input search
  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, search: value };
      if (!value.trim()) {
        setRoles(originalRoles);
        updated.totalRoles = originalRoles.length;
      }
      return updated;
    });
  };

  function handleRole() {
    navigate("/layout/role-list/add-role");
  }
  return {
    dataSource,
    currentPage,
    formData,
    handleRole,
    handleTable,
    searchHandle,
    statusHandle,
    handleOnChangeSearch,
    setCurrentPage,
    setFormData,
    toggleActive,
    viewDetails,
  }
}

export default useRole;
