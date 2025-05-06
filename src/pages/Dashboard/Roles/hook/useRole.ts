// Import thư viện ngoài
import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';

// Import nội bộ
import { Role, RoleTable } from "../../../../types/Role";
import { roleSearchFilter, roleActive, deleteRole } from "../../../../services/roleService";
import { showConfirmModal } from "../../../../utils/showConfimModal";
import { formatTime } from "../../../../utils/formatTime";
import { setId } from "../../../../redux/userSlice";
import { useMutation } from "@tanstack/react-query";


function useRole() {
  //mang ca doi tuong role
  const [roles, setRoles] = useState<Role[]>([]);
  const [originalRoles, setOriginalRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<boolean[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRoles, setTotalRoles] = useState<number>(0);
  // tinh lai tong so trang moi khi co thay doi
  const totalPages = useMemo(() => Math.ceil(totalRoles / pageSize), [totalRoles, pageSize]);

  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const dataSource: RoleTable[]  = roles?.map((item) => ({ ...item, key: item.id }));

  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {mutate} = useMutation({
    mutationFn: () => roleSearchFilter({
      sortKey: sortField,
      sortBy: sortOrder,
      searchKey: search,
      isActive: status,
      page: currentPage,
      size: pageSize,
    }),
    onSuccess: (response) => {
      const results = response.data.results;
      const newResult = results?.content.map((item: Role) => ({
        ...item,
        updateAt: formatTime(item.updateAt),
      }));
      setRoles(newResult);
      setOriginalRoles(newResult);
      setTotalRoles(results.totalElements);
    },
    onError: () => {
      toast.error(" Unable to retrieve roles. Please try again later.");
    }

  }) 

  useEffect(() => {
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(0);
    }
    mutate();
  }, [currentPage, search, status, pageSize, sortField, sortOrder]);

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
      toast.error("Failed to update role status. Please try again.");
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
      setSortField(sort.field as string);
      setSortOrder(sort.order === "ascend" ? "ASC" : "DESC");

    } else {
      setSortField("");
      setSortOrder("ASC");
    }
  };
  /// search customer

  const searchHandle = 
    (value: string) => {
      setSearch(value);
      setCurrentPage(0);
    };

  //status filter
  const statusHandle = (value: boolean[]) => {
    setStatus(value);
    setCurrentPage(0);
  };
  

  function handleRole() {
    navigate("/layout/role-list/add-role");
  }


  
  const handleDelete = async (id: string | number) => {
    showConfirmModal({
      onConfirm: async () => {
        try {
         const results = await deleteRole(id);
          setRoles((prev) => prev.filter((role) => role.id !== id));
          setOriginalRoles((prev) => prev.filter((role) => role.id !== id));
          setTotalRoles(results.data.resultstotalElements);
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
    search,
    status,
    totalPages,
    originalRoles,
    pageSize,
    totalRoles,
    dataSource,
    currentPage,
    setSearch,
    setRoles,
    setOriginalRoles,
    setStatus,
    setTotalRoles,
    setPageSize,
    setSortField,
    setSortOrder,
    handleRole,
    handleTable,
    searchHandle,
    statusHandle,
    setCurrentPage,
    toggleActive,
    viewDetails,
    handleDelete
  }
}

export default useRole;
