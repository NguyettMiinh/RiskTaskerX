import { useState } from "react";
import { addRoles } from "@/services/roleService";
import { toast } from "react-toastify";
import "../../../assets/styles/role.css";
import { useNavigate } from "react-router";
import { usePermissions } from "@components/hook/usePermissions";


function useAddRole() {
  const [value, setValue] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [childCategory, setChildCategory] = useState([]);
  const [role, setRoles] = useState({
    name: "",
    isActive: true,
    permissions: [],
    error: "",
    loading: false,   
  });

  const { name, isActive, isError, loading } = role;

  const { data } = usePermissions();
  const categories = data?.data.results;

  const handleCheckBox = (value, checked) => {
    if (checked) {
      setValue((prev) => [...prev, value]);
    } else {
      setValue((prev) => prev.filter((item) => item !== value));
    }
  };

  const handlePermissions = (category) => {
    if (category.name === "Admin & Role Management") {
      setChildCategory(category.children || []);
      setSelectedCategory(null);
      setPermissions([]);
    } else {
      setSelectedCategory(category);
      setPermissions(category.children || []);
    }
  };
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      await addRoles(name, isActive, value);
      navigate("/layout/role-list");
      toast.success("New role has been added successfully!");
      setName("");
      setValue([]);
      setSelectedCategory(null);
      setPermissions([]);
      setIsActive(true);
      setIsError("");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "role-already-exists") {
        setIsError("This role name is already taken.");
      }
      if (message === "invalid-role-name") {
        setIsError("Role Name is required.");
      }
    }
  };

  const toggleActive = async (checked) => {
    if (loading) return;
    setLoading(true);
    setIsActive(checked);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const checkAll = selectedCategory?.children
    ?.map((item) => item.id)
    .every((id) => value.includes(id));

  const handleAll = (checked) => {
    if (checked) {
      const all = permissions.map((option) => option.id);
      setValue((prev) => [...new Set([...prev, ...all])]);
    } else {
      const idsToRemove = permissions.map((option) => option.id);
      setValue((prev) => prev.filter((id) => !idsToRemove.includes(id)));
    }
  };
  function handleCancel() {
    navigate("/layout/role-list");
  }
  return {

  }
}

export default useAddRole;
