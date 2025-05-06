import { downloadFile } from "../../../../utils/exportUtils";
import { showExportModal } from "../../../../utils/modalUtils";
import { showConfirmModal } from "../../../../utils/showConfimModal";
import { TablePaginationConfig } from "antd/es/table";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import {
  PageName,
  SORTBYASC,
  SORTBYDESC,
  ToastNotif,
} from "../../../../constants/Variable";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminService from "../../../../services/adminService";
import { Admin, AdminSearchAndFilterRequest } from "../../../../types/Admin";
import { useModalStore } from "../../../../utils/modalStore";

function useAdmin() {
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const totalPages = Math.ceil(totalAdmins / pageSize);
  const admins = useModalStore((state) => state.admins);
  const setAdmins = useModalStore((state) => state.setAdmins);
  const [originalAdmin, setOriginalAdmin] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterRoleAdmin] = useState<boolean[]>([]);
  const [filterDepartmentAdmin, setFilterDepartmentAdmin] = useState<string[]>(
    []
  );
  const [sortField, setSortField] = useState<string | undefined>("");
  const [sortOrder, setSortOrder] = useState<
    typeof SORTBYASC | typeof SORTBYDESC | ""
  >("");
  const [loading, setLoading] = useState<boolean>(false);
  const setEditMode = useModalStore((state) => state.setEditMode);
  const setVisible = useModalStore((state) => state.setVisible);
  const setEditingUserId = useModalStore((state) => state.setEditingUserId);
  
  const payload: AdminSearchAndFilterRequest = {
    sortKey: sortField ? sortField : "id",
    filters: {
      searchKey: search,
      departmentName: filterDepartmentAdmin,
      isActive: filterStatus,
    },
    page: currentPage,
    size: pageSize,
    sortBy: sortOrder ? sortOrder : SORTBYASC,
  };

  const updateAdminStatus = (id: number, isActive: boolean) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === id ? { ...admin, isActive } : admin
    );
    setAdmins(updatedAdmins);
  };

  const handleApiUpdate = async (id: number, isActive: boolean) => {
    try {
      const response = await adminService.setIsActiveAdmin(id, isActive);
      if (!response) {
        updateAdminStatus(id, !isActive);
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
      updateAdminStatus(id, !isActive);
    }
  };

  // put isActive
  const toggleActive = (id: number, isActive: boolean) => {
    showConfirmModal({
      onConfirm: async () => {
        updateAdminStatus(id, isActive);
        await handleApiUpdate(id, isActive);
        if (isActive) {
          toast.success(ToastNotif.toastActived, {
            className: ToastNotif.classNameToast,
          });
        } else {
          toast.success(ToastNotif.toastDeActived, {
            className: ToastNotif.classNameToast,
          });
        }
      },
      name: ToastNotif.adminName,
      action: isActive ? ToastNotif.active : ToastNotif.deactive,
    });
  };

  ///filter status
  const filterStatusHandle = (value: boolean[]) => {
    setFilterRoleAdmin(value);
    setCurrentPage(0);
  };

  //filter department
  const filterDepartmentHandle = (value: string[]) => {
    setFilterDepartmentAdmin(value);
    setCurrentPage(0);
  };
  // searchHandle
  const searchHandle = useCallback(
    (value: string) => {
      setSearch(value);
      setCurrentPage(0);
    },
    [search]
  );

  // view detail admin
  const viewDetails = (id: number) => {
    setEditMode(true);
    setEditingUserId(id);
    setVisible(true);
  };

  /// export file
  const exportHandle = async () => {
    try {
      const response = await adminService.exportAdmin(payload);
      const password = downloadFile(response);
      showExportModal(password, "Admin Account List");
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const handleTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Admin> | SorterResult<Admin>[],
    extra: TableCurrentDataSource<Admin>
  ) => {
    const sort = Array.isArray(sorter) ? sorter[0] : sorter;
    if (sort && sort.order && sort.field) {
      const { field, order } = sort;
      setSortField(field as string);
      setSortOrder(order === "ascend" ? SORTBYASC : SORTBYDESC);
    } else {
      setSortField("id");
      setSortOrder(SORTBYASC);
    }
  };

  const handleAdd = () => {
    setEditMode(false);
    setVisible(true);
  };
  useEffect(() => {
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(0);
    }
    fetchData();
  }, [
    currentPage,
    search,
    filterStatus,
    filterDepartmentAdmin,
    sortField,
    sortOrder,
    pageSize,
    totalPages,
    totalAdmins,
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminService.searchAndFilterAdmin(payload);
      if (response && response) {
        const truncatedData = response.results.content.map((item: Admin) => ({
          ...item,
          fullName:
            item.fullName.length > 2
              ? item.fullName.substring(0, 2) + "*".repeat(12)
              : item.fullName,
          email:
            item.email.length > 2
              ? item.email.substring(0, 2) + "*".repeat(12)
              : item.email,
          lastLogin: item.lastLogin
            ? dayjs(item.lastLogin).format(PageName.formatDateTime)
            : "",
        }));
        setAdmins(truncatedData);
        setOriginalAdmin(truncatedData);
        setTotalAdmins(response.results.totalElements || 0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin list:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    pageSize,
    admins,
    totalAdmins,
    totalPages,
    currentPage,
    originalAdmin,
    search,
    loading,
    setSearch,
    setPageSize,
    setOriginalAdmin,
    setTotalAdmins,
    fetchData,
    handleTable,
    exportHandle,
    viewDetails,
    searchHandle,
    filterDepartmentHandle,
    filterStatusHandle,
    toggleActive,
    handleAdd,
    setAdmins,
    setCurrentPage,
  };
}

export default useAdmin;
