import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setId } from "@/redux/userSlice";
import {
  exportApi,
  isActiveApi,
  segCustomer,
} from "@/services/customerService";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { showConfirmModal } from "@/utils/showConfimModal";

const useCustomer = () => {
  const [customer, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Default to page 1
  const [formData, setFormData] = useState({
    search: "",
    tiers: [],
    status: [],
    pageSize: 10,
    totalCustomers: 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search, tiers, status, pageSize,totalCustomers } = formData;

  useEffect(() => {
    fetchCustomers(currentPage, search, tiers, status, pageSize);
  }, [currentPage, search, tiers, status, pageSize]);

  const fetchCustomers = async (page) => {
    try {
      const response = await segCustomer({
        searchKey: search,
        tier: tiers,
        isActive: status,
        page: page,
        size: pageSize,
      });
      if (response && response.results) {
        const truncatedData = response.results.content.map((item) => ({
          ...item,
          id: item.id.length > 12 ? item.id.substring(0, 12) : item.id,
          fullName:
            item.fullName.length > 12
              ? item.fullName.substring(0, 12)
              : item.fullName,
          phoneNumber:
            item.phoneNumber.length > 12
              ? item.phoneNumber.substring(0, 12)
              : item.phoneNumber,
          address:
            item.address.length > 12
              ? item.address.substring(0, 12)
              : item.address,
          email:
            item.email.length > 12 ? item.email.substring(0, 12) : item.email,
        }));
        setCustomers(truncatedData);
        setOriginalCustomers(truncatedData);
        setFormData({
          ...formData,
          totalCustomers: response.results.totalElements,
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const viewDetails = (id) => {
    dispatch(setId(id));
    setTimeout(() => {
      navigate(`/layout/customer/detail/${id}`);
    }, 100);
  };

  const updateCustomerStatus = (id, isActive) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id ? { ...customer, isActive } : customer
      )
    );
  };

  const handleApiUpdate = async (id, isActive) => {
    try {
      const response = await isActiveApi(id, isActive);
      if (!response) {
        updateCustomerStatus(id, !isActive);
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      updateCustomerStatus(id, !isActive);
    }
  };

  const toggleActive = (id, isActive) => {
    showConfirmModal(
      isActive,
      async () => {
        updateCustomerStatus(id, isActive);
        await handleApiUpdate(id, isActive);
      },
      "customer"
    );
  };

  const searchHandle = (value) => {
    setFormData({ ...formData, search: value });
    setCurrentPage(0); 
  };

  const tierHandle = (value) => {
    setFormData({ ...formData, tiers: value });
    setCurrentPage(0); 
  };

  const statusHandle = (value) => {
    setFormData({ ...formData, status: value });
    setCurrentPage(0); 
  };

  const handleOnChangeSearch = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, search: value };
      if (!value.trim()) {
        setCustomers(originalCustomers);
        updated.totalCustomers = originalCustomers.length;
      }
      return updated;
    });
  };

  const exportHandle = async (searchValue, filterCustomer, status) => {
    try {
      const response = await exportApi({
        tier: filterCustomer,
        isActive: status,
        searchKey: searchValue,
        page: currentPage,
        size: pageSize,
      });
      const password = downloadFile(response);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const dataSource = customer?.map((item) => ({ ...item, key: item.id }));

  return {
    currentPage,
    formData,
    dataSource,
    setCurrentPage,
    setFormData,
    searchHandle,
    tierHandle,
    statusHandle,
    handleOnChangeSearch,
    exportHandle,
    viewDetails,
    toggleActive,
  };
};

export default useCustomer;
