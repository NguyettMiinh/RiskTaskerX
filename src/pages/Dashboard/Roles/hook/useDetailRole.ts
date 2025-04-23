
import { useEffect, useState } from "react";
import { getRoles, editRoles } from "../../../../services/roleService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { usePermissions } from "@components/hook/usePermissions";
import { useQuery } from "@tanstack/react-query";
import { Category, ActionForm, Role } from "../../../../types/Role";
import { RootState } from '../../../../redux/store';

function useDetailRole() {

  const [editForm, setEditForm] = useState<ActionForm>({
    name: "",
    isActive: false,
    permissions: [],
    isError: "",
  });
  
  const { name, isActive, permissions } = editForm;
  const id = useSelector((state: RootState) => state.user.id);

  const { data: categoriesData } = usePermissions();
  const categories: Category[] = categoriesData?.data.results;

  const { data: roleData } = useQuery({
    queryKey: ["role", id],
    queryFn: () => getRoles(id),
  });

  //luc dau roleData undefined, set lien vao form se bi loi
  // chi goi khi co roleDate
  useEffect(() => {
    if (roleData?.data?.results) {
      const role : Role  = roleData.data.results;
      setEditForm({
        name: role.name || "",
        isActive: role.isActive ?? true,
        permissions: role.permissions?.map((item) => item.id) || [],
      });
    }
  }, [roleData]);

  const navigate = useNavigate();
  function handleCancel() {
    navigate("/layout/role-list");
  }

  const handleSave = async () => {
    try {
      await editRoles(
        id,
        name,
        isActive,
        permissions
      );
      
      navigate("/layout/role-list");
      toast.success("Changes have been saved successfully!");
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message === "role-already-exists") {
        setEditForm({ ...editForm, isError: "This role name is already taken." });
      }
      if (message === "invalid-role-name") {
        setEditForm({ ...editForm, isError: "Role name is required." });
      }
    }
  };

  const handleAllCheckBox = (checked: boolean, all: number[]) => {
    if (checked) {
      setEditForm((prev) => ({
        ...prev,
        permissions: [...prev.permissions, ...all],
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !all.includes(id)),
      }));
    }
  };

  const handleCheckBox = (value: number, checked: boolean) => {
    setEditForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value] 
        : prev.permissions.filter((item) => item !== value), 
    }));
  };

  const toggleActive = (checked: boolean) => {
    setEditForm({
      ...editForm,
      isActive: checked,
    });
  };
  return {
    editForm,
    categories,
    setEditForm,
    handleSave,
    toggleActive,
    handleCheckBox,
    handleAllCheckBox,
    handleCancel,
  };
}

export default useDetailRole;
