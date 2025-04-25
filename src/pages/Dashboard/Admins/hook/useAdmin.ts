import { downloadFile } from "../../../../utils/exportUtils";
import { useModalStore } from "../../../../utils/modalStore";
import { showExportModal } from "../../../../utils/modalUtils";
import { showConfirmModal } from "../../../../utils/showConfimModal";
import { TablePaginationConfig } from "antd/es/table";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import {
  ExceptionAdmin,
  PageName,
  SORTBYASC,
  SORTBYDESC,
  ToastNotif,
} from "../../../../constants/Variable";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminService from "../../../../services/adminService";
import {
  Admin,
  AdminAddRequest,
  AdminSearchAndFilterRequest,
  AdminUpdateRequest,
} from "../../../../types/Admin";
import { Form } from "antd";
import axios from "axios";

function useAdmin() {
  const [form] = Form.useForm();
  const visible = useModalStore((state) => state.visible);
  const isEditMode = useModalStore((state) => state.isEditMode);
  const editingUserId = useModalStore((state) => state.editingUserId);
  const isActive = Form.useWatch("isActive", form);
  const [originalAdmin, setOriginalAdmin] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterRoleAdmin] = useState<boolean[]>([]);
  const [filterDepartmentAdmin, setFilterDepartmentAdmin] = useState<string[]>(
    []
  );
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [sortField, setSortField] = useState<string | undefined>("");
  const [sortOrder, setSortOrder] = useState<
    typeof SORTBYASC | typeof SORTBYDESC | ""
  >("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const totalPages = Math.ceil(totalAdmins / pageSize);
  const setEditMode = useModalStore((state) => state.setEditMode);
  const setVisible = useModalStore((state) => state.setVisible);
  const setEditingUserId = useModalStore((state) => state.setEditingUserId);
  const admins = useModalStore((state) => state.admins);
  const setAdmins = useModalStore((state) => state.setAdmins);

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
      showExportModal(password);
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

  useEffect(() => {
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(totalPages);
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
            : "00:00 00-00-0000",
        }));
        setAdmins(truncatedData);
        setOriginalAdmin(truncatedData);
        setTotalAdmins(response.results.totalElements || 0);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admin list:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditMode(false);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setEditingUserId(null);
    form.resetFields();
  };

  const handleUpdateAdmin = useCallback(
    async (values: AdminUpdateRequest) => {
      console.log(values);
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).toISOString(),
        role: {
          id: values.role.id,
          createAt: null,
          updateAt: null,
          name: null,
          isActive: null,
        },
        lastLogin: dayjs().toISOString(),
        name: values.fullName,
      };
      console.log(payload);
      delete (payload as any).lastLogin;
      await adminService.updateAdmin(payload);
      toast.success(ToastNotif.toastUpdateAdmin, {
        className: ToastNotif.classNameToast,
      });
      fetchData();
    },
    [isActive, form.getFieldValue]
  );
  const handleAddAdmin = async (values: AdminAddRequest) => {
    console.log(values);
    try {
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).toISOString(),
        role: {
          id: values.role.id,
          createAt: null,
          updateAt: null,
          name: null,
          isActive: true,
        },
        name: values.fullName,
      };
      await adminService.addAdmin(payload);
      toast.success(ToastNotif.toastAddAdmin, {
        className: ToastNotif.classNameToast,
      });
      fetchData();
      setVisible(false);
      form.resetFields();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data.message;
        if (status === 400) {
          if (message === ExceptionAdmin.email) {
            form.setFields([
              {
                name: "email",
                errors: !isEditMode? ["Email is existed."] : [],
              },
            ]);
          }
          if (message === ExceptionAdmin.phoneNumber) {
            form.setFields([
              {
                name: "phoneNumber",
                errors: ["Phone Number is existed."],
              },
            ]);
          } else {
            console.log("Unhandled message:", message);
          }
        }
      } else {
        console.log("Lỗi khác");
      }
    }
  };
  const handleOk = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          handleUpdateAdmin(values);
          setVisible(false);
          form.resetFields();
        } else {
          handleAddAdmin(values);
        }
      })
      .catch((info) => {
        console.log("Validate failed with errors:", info);
      });
  }, [form, isEditMode]);

  const showAdminDetail = async () => {
    try {
      if (editingUserId) {
        setLoading(true);
        const data = await adminService.getAdminById(editingUserId);
        if (data && data.httpStatus === "OK") {
          const formattedDate = data.results.dateOfBirth
            ? dayjs(data.results.dateOfBirth)
            : null;
          form.setFieldsValue({
            ...data.results,
            dateOfBirth: formattedDate,
            lastLogin: data.results.lastLogin
              ? dayjs(data.results.lastLogin).format(PageName.formatDateTime)
              : null,
          });
          console.log(data.results);
        } else {
          console.log("Lỗi");
        }
      } else {
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && isEditMode) {
      showAdminDetail();
    }
  }, [visible, isEditMode, form]);

  return {
    handleAdd,
    fetchData,
    handleTable,
    exportHandle,
    viewDetails,
    searchHandle,
    filterDepartmentHandle,
    filterStatusHandle,
    setAdmins,
    toggleActive,
    setTotalAdmins,
    setSearch,
    setPageSize,
    setCurrentPage,
    handleCancel,
    showAdminDetail,
    handleUpdateAdmin,
    handleOk,
    visible,
    isEditMode,
    editingUserId,
    isActive,
    form,
    totalAdmins,
    admins,
    pageSize,
    totalPages,
    loading,
    currentPage,
    originalAdmin,
    search,
  };
}

export default useAdmin;
