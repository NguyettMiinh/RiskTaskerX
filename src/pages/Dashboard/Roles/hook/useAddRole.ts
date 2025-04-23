import { useState } from "react";
import { addRoles } from "../../../../services/roleService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { usePermissions } from "@components/hook/usePermissions";
import { Category, Role } from "../../../../types/Role";
interface AddForm {
    name: string;
    isActive: boolean;
    permissions: number[];
    isError: string;
}

function useAddRole() {

  const [addForm, setAddForm] = useState<AddForm>({
    name: "",
    isActive: true,
    permissions: [],
    isError: "",
  });

  const { name, isActive, permissions, isError } = addForm;

  const { data } = usePermissions();
  const categories: Category[] = data?.data.results;



  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await addRoles(name, isActive, permissions);
      navigate("/layout/role-list");
      toast.success("New role has been added successfully!");
      setAddForm({
        name: "",
        isActive: true,
        permissions: [],
        isError: "",
      });
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message === "role-already-exists") {
        setAddForm({ ...addForm, isError: "This role name is already taken." });
      }
      if (message === "invalid-role-name") {
        setAddForm({ ...addForm, isError: "Role name is required." });
      }
    }
  };

  const toggleActive = async (checked: boolean) => {
    setAddForm({
      ...addForm,
      isActive: checked,
    });
  };

  const handleCheckBox = (value: number, checked: boolean) => {
    setAddForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value] // thêm
        : prev.permissions.filter((item) => item !== value), // xoá
    }));
  };

  const handleAllCheckBox = (checked: boolean, all: number[]) => {
    if (checked) {
      setAddForm((prev) => ({
        ...prev,
        permissions: [...prev.permissions, ...all],
      }));
    } else {
      setAddForm((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !all.includes(id)),
      }));
    }
  };
  function handleCancel() {
    navigate("/layout/role-list");
  }

  return {
    addForm,
    categories,
    setAddForm,
    handleAdd,
    toggleActive,
    handleCheckBox,
    handleAllCheckBox,
    handleCancel,
  }
}

export default useAddRole;
