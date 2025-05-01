// Import thư viện ngoài
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';

// Import nội bộ
import { Role, RoleForm, RoleTable } from "../../../../types/Role";
import { roleSearchFilter, roleActive, deleteRole } from "../../../../services/roleService";
import { showConfirmModal } from "../../../../utils/showConfimModal";
import { formatTime } from "../../../../utils/formatTime";
import { setId } from "../../../../redux/userSlice";
import {OptionValue} from "../../../../types/Select";


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
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateRoleStatus(id, !isActive);
    }
    
  };
  // put isActive
  const toggleActive = (id: string | number, isActive: boolean) => {
    showConfirmModal({ onConfirm:
      async () => {
        updateRoleStatus(id, isActive);
        await handleApiUpdate(id, isActive);
        if (isActive) {
          toast.success("Role successfully activated");
        } else {
          toast.success("Role successfully deactivated");
        }
      },
      name: "role", action: isActive ? "activate" : "deactivate"
  });
  };


  //sort
  const handleTable = (pagination: TablePaginationConfig,  filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Role> | SorterResult<Role>[],  extra: TableCurrentDataSource<Role>) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    if (sort.order) {
      setFormData({
        ...formData,
        sortField: sort.field as string,
        sortOrder: sort.order === "ascend" ? "ASC" : "DESC",
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
  const statusHandle = (value: OptionValue[]) => {
    const booleanValues = value as boolean[];
    setFormData({ ...formData, status: booleanValues });
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

  
  const handleDelete = async (id: string | number) => {
    showConfirmModal({
      onConfirm: async () => {
        try {
          await deleteRole(id);
          setRoles((prev) => prev.filter((role) => role.id !== id));
          setOriginalRoles((prev) => prev.filter((role) => role.id !== id));
          toast.success("Role deleted successfully!");
        } catch (error: any) {
          const message = error.response?.data?.message;
          if (message === "role-in-use-by-admin") {
            toast.error("Cannot delete role. There are still admins assigned to this role.");
          } else {
            toast.error("Something went wrong.");
          }
        }
      },
      name: "role",
      action: "delete",
    });
  };
  
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
    handleDelete
  }
}

export default useRole;
