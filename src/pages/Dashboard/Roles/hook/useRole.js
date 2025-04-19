// Import thư viện ngoài
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// Import nội bộ
import { roleSearchFilter, roleActive } from "@/services/roleService";
import { showConfirmModal } from "@/utils/showConfimModal";
import { formatTime } from "@/utils/formatTime";
import { setId } from "@/redux/userSlice";

function useRole() {
  const [roles, setRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dataSource = roles?.map((item) => ({ ...item, key: item.id }));
  const [formData, setFormData] = useState({
    search: "",
    status: [],
    sortField: "",
    sortOrder: "ASC",
    pageSize: 10,
    totalRoles: 0,
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search, status, sortField, sortOrder, pageSize, totalRoles } =
    formData;
    
  useEffect(() => {
    fetchRoles(currentPage, search, status, pageSize, sortField, sortOrder);
  }, [currentPage, search, status, pageSize, sortField, sortOrder]);

  const fetchRoles = async (page) => {
    try {
      const response = await roleSearchFilter({
        sortKey: sortField,
        sortBy: sortOrder,
        searchKey: search,
        isActive: status,
        page: page,
        size: pageSize,
      });
      const results = response.data.results;
      const newResult = results?.content.map((item) => ({
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


  const viewDetails = (id) => {
    dispatch(setId(id));
    setTimeout(() => {
      navigate("/layout/role-list/role-detail");
    }, 100);
  };
  const updateRoleStatus = (id, isActive) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.id === id ? { ...role, isActive } : role))
    );
  };
  const handleApiUpdate = async (id, isActive, setRoles) => {
    try {
      const response = await roleActive(id, isActive);
      if (!response) {
        updateRoleStatus(id, !isActive, setRoles);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateRoleStatus(id, !isActive, setRoles);
    }
  };
  // put isActive
  const toggleActive = (id, isActive, setRoles) => {
    showConfirmModal(
      isActive,
      async () => {
        updateRoleStatus(id, isActive, setRoles);
        await handleApiUpdate(id, isActive, setRoles);
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
  const handleTable = (pagination, filters, sorter) => {
    if (sorter.order) {
      setFormData({
        ...formData,
        sortField: sorter.field,
        sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
      });
    } else {
      setFormData({ ...formData, sortField: null, sortOrder: null });
    }
  };
  /// search customer
  const searchHandle = (value) => {
    setFormData({ ...formData, search: value });
    setCurrentPage(0);
  };
  //status filter
  const statusHandle = (value) => {
    setFormData({ ...formData, status: value });
    setCurrentPage(0);
  };
  // onChange input search
  const handleOnChangeSearch = (e) => {
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
