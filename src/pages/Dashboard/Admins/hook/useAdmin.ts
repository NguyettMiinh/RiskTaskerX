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
import { SORTBYASC, SORTBYDESC } from "../../../../constants/Variable";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminService from "../../../../services/adminService";
import {
  Admin,
  AdminSearchAndFilterRequest,
  AdminUpdateRequest,
  FieldColumn,
} from "../../../../types/Admin";
import { Form } from "antd";

type optionFilter = {
  label: string;
  value: string;
};

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
    showConfirmModal(
      isActive,
      async () => {
        updateAdminStatus(id, isActive);
        await handleApiUpdate(id, isActive);
        if (isActive) {
          toast.success("Admin successfully activated", {
            className: "custom-toast",
          });
        } else {
          toast.success("Admin successfully deactivated", {
            className: "custom-toast",
          });
        }
      },
      "admin"
    );
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
            item.fullName.length > 12
              ? item.fullName.substring(0, 12)
              : item.fullName,
          email:
            item.email.length > 12 ? item.email.substring(0, 12) : item.email,
          lastLogin: dayjs(item.lastLogin).format("HH:mm DD-MM-YYYY"),
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
  const onSuccess = () => {
    fetchData();
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
      toast.success("Changes have been saved successfully", {
        className: "custom-toast",
      });
      onSuccess();
    },
    [isActive, form.getFieldValue]
  );
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          handleUpdateAdmin(values);
        } else {
          console.log("Thêm dữ liệu mới:", values);
        }
        setVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const showAdminDetail = async () => {
    try {
      if (editingUserId) {
        setLoading(true);
        const data = await adminService.getAdminById(editingUserId);
        if (data && data.httpStatus == "OK") {
          const formattedDate = data.results.dateOfBirth
            ? dayjs(data.results.dateOfBirth)
            : null;
          form.setFieldsValue({
            ...data.results,
            dateOfBirth: formattedDate,
            lastLogin: dayjs(data.results.lastLogin).format("HH:mm DD-MM-YYYY"),
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

  const onFinish = (values: any) => {
    console.log(values);
    console.log("Form submitted with values: ", values);
  };
  return {
    handleAdd,
    onSuccess,
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
    onFinish,
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
