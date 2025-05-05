import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setId } from "../../../../redux/userSlice";
import {
  exportApi,
  isActiveApi,
  getCustomer,
} from "../../../../services/customerService";
import { downloadFile } from "../../../../utils/exportUtils";
import { showExportModal } from "../../../../utils/modalUtils";
import { showConfirmModal } from "../../../../utils/showConfimModal";
import {
  Customer,
  CustomerForm,
  CustomerTable,
} from "../../../../types/Customer";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

const useCustomer = () => {
  const [customer, setCustomers] = useState<Customer[]>([]);
  const [originalCustomers, setOriginalCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<boolean[]>([]);
  const [tiers, setTiers] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);

  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const totalPages = Math.ceil(totalCustomers / pageSize);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const response = await getCustomer({
        searchKey: search,
        tier: tiers,
        isActive: status,
        page: currentPage,
        size: pageSize,
      });
      if (response && response.results) {
        const truncatedData = response.results.content.map(
          (item: Customer) => ({
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
          })
        );
        setCustomers(truncatedData);
        setOriginalCustomers(truncatedData);
        setTotalCustomers(response.results.totalElements);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(0);
    }
    fetchCustomers();
  }, [currentPage, search, tiers, status, pageSize]);

  const viewDetails = (id: string) => {
    dispatch(setId(id));
    setTimeout(() => {
      navigate(`/layout/customer/detail/${id}`);
    }, 100);
  };

  const updateCustomerStatus = (id: string | number, isActive: boolean) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id ? { ...customer, isActive } : customer
      )
    );
  };

  const handleApiUpdate = async (id: string | number, isActive: boolean) => {
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

  const toggleActive = (id: string | number, isActive: boolean) => {
    showConfirmModal({
      onConfirm: async () => {
        updateCustomerStatus(id, isActive);
        await handleApiUpdate(id, isActive);
        if (isActive) {
          toast.success("Customer successfully activated");
        } else {
          toast.success("Customer successfully deactivated");
        }
      },
      name: "customer",
      action: isActive ? "activate" : "deactivate",
    });
  };

  const searchHandle = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const tierHandle = (value: string[]) => {
    setTiers(value);
    setCurrentPage(0);
  };

  const statusHandle = (value: boolean[]) => {
    setStatus(value);
    setCurrentPage(0);
  };

  const exportHandle = async () => {
    try {
      const response = await exportApi({
        tier: tiers,
        isActive: status,
        searchKey: search,
        page: currentPage,
        size: pageSize,
      });
      const password = downloadFile(response);
      showExportModal(password, "Customer List");
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const dataSource: CustomerTable[] = customer?.map((item) => ({
    ...item,
    key: item.id,
  }));

  return {
    search,
    totalPages,
    originalCustomers,
    totalCustomers,
    currentPage,
    dataSource,
    status,
    tiers,
    pageSize,
    setCurrentPage,
    searchHandle,
    tierHandle,
    statusHandle,
    exportHandle,
    viewDetails,
    toggleActive,
    setCustomers,
    setSearch,
    setTotalCustomers,
    setPageSize,
    setStatus,
    setTiers,
  };
};

export default useCustomer;
