import { useState, useEffect } from "react";
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
import { Customer, CustomerForm, CustomerTable} from "../../../../types/Customer";
import { toast } from "react-toastify";

const useCustomer = () => {
  const [customer, setCustomers] = useState<Customer[]>([]);
  const [originalCustomers, setOriginalCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [formData, setFormData] = useState<CustomerForm>({
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
    fetchCustomers(currentPage);
  }, [currentPage, search, tiers, status, pageSize]);

  const fetchCustomers = async (page:number) => {
    try {
      const response = await getCustomer({
        searchKey: search,
        tier: tiers,
        isActive: status,
        page: page,
        size: pageSize,
      });
      if (response && response.results) {
        const truncatedData = response.results.content.map((item: Customer) => ({
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
    showConfirmModal({ onConfirm:
      async () => {
        updateCustomerStatus(id, isActive);
        await handleApiUpdate(id, isActive);
        if (isActive) {
          toast.success("Role successfully activated");
        } else {
          toast.success("Role successfully deactivated");
        }
      },
      name: "customer", action: isActive ? "activate" : "deactivate"
  });
  };

  const searchHandle = (value: string) => {
    setFormData({ ...formData, search: value });
    setCurrentPage(0); 
  };

  const tierHandle = (value: string[]) => {
    setFormData({ ...formData, tiers: value });
    setCurrentPage(0); 
  };

  const statusHandle = (value: boolean[]) => {
    setFormData({ ...formData, status: value });
    setCurrentPage(0); 
  };

  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const dataSource: CustomerTable[] = customer?.map((item) => ({ ...item, key: item.id }));

  return {
    totalCustomers,
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
