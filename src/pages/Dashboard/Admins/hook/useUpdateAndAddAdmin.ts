import { RoleOption } from "../../../../utils/fieldConfigs";
import axios from "axios";
import {
  ExceptionAdmin,
  PageName,
  ToastNotif,
} from "../../../../constants/Variable";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminService from "../../../../services/adminService";
import { useModalStore } from "../../../../utils/modalStore";
import {
  AdminAddRequest,
  AdminUpdateRequest,
  RoleListActive,
} from "../../../../types/Admin";
import useAdmin from "./useAdmin";
import { Form } from "antd";
import utc from "dayjs/plugin/utc";

function useUpdateAndAddAdmin() {
  dayjs.extend(utc);
  const [form] = Form.useForm();
  const isActive = Form.useWatch("isActive", form);
  const [roleOption, setRoleOption] = useState<RoleOption[]>();
  const visible = useModalStore((state) => state.visible);
  const isEditMode = useModalStore((state) => state.isEditMode);
  const editingUserId = useModalStore((state) => state.editingUserId);
  const setEditMode = useModalStore((state) => state.setEditMode);
  const setVisible = useModalStore((state) => state.setVisible);
  const setEditingUserId = useModalStore((state) => state.setEditingUserId);
  const [loading, setLoading] = useState<boolean>(false);

  const { fetchData } = useAdmin();

  const handleCancel = () => {
    setVisible(false);
    setEditingUserId(null);
    form.resetFields();
  };

  const handleUpdateAdmin = useCallback(
    async (values: AdminUpdateRequest) => {
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).utc(true).toISOString(),
        role: {
          id: values.role.id,
          name: values.role.name,
        },
        lastLogin: dayjs().toISOString(),
        name: values.fullName,
      };
      console.log(payload);

      await adminService.updateAdmin(payload);
      toast.success(ToastNotif.toastUpdateAdmin, {
        className: ToastNotif.classNameToast,
      });
      fetchData();
      setVisible(false);
    },
    [isActive, form]
  );
  const handleAddAdmin = async (values: AdminAddRequest) => {
    try {
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).utc(true).toISOString(),
        role: {
          id: values.role.id,
          name: values.role.name,
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
                errors: !isEditMode ? ["Email is existed."] : [],
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
        console.log(values);
        if (isEditMode) {
          handleUpdateAdmin(values);
        } else {
          handleAddAdmin(values);
        }
      })
      .catch((info) => {
        console.log("Validate failed with errors:", info);
      });
  }, [form, isEditMode]);

  const showAdminDetail = async () => {
    setLoading(true);
    try {
      if (editingUserId) {
        const data = await adminService.getAdminById(editingUserId);
        console.log(data.results);
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
          console.log(form.getFieldsValue());
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

  const getRoleActiveOption = async () => {
    try {
      const response = await adminService.getRoleListActive();
      const result = response.results.map((item: RoleListActive) => ({
        label: item.name,
        value: item.id,
      }));
      setRoleOption(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (visible && isEditMode) {
      showAdminDetail();
    } else {
      getRoleActiveOption();
    }
  }, [visible, isEditMode, form]);
  return {
    roleOption,
    form,
    isActive,
    loading,
    isEditMode,
    visible,
    handleOk,
    handleCancel,
    setEditMode,
  };
}

export default useUpdateAndAddAdmin;
