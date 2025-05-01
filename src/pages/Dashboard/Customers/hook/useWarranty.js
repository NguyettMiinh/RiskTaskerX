import { useEffect, useState } from "react";
import {
  exportWarranty,
  getWarranty,
  addWarrantyData,
} from "@/services/customerService";
import { useSelector } from "react-redux";
import { downloadFile } from "@/utils/exportUtils";
import { showExportModal } from "@/utils/modalUtils";
import { formatDate } from "@/utils/formatDate";
import { formatMoney } from "@/utils/formatMoney";
import { formatCenter } from "@/utils/formatCenter";
import { toast } from "react-toastify";
import {  useMutation } from "@tanstack/react-query";

const useWarranty = () => {
  const [warranty, setWarranty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalWarranty, setTotalWarranty] = useState(0);
  const id = useSelector((state) => state.user.id);

  const dataSource = warranty.map((item) => ({ ...item, key: item.id }));

  const {
    mutate: getDataWarranty,
  } = useMutation({
    mutationFn: ({page, customerId}) =>  getWarranty({page,customerId}),
    //sau khi mutate : api thanh cong thi se xu li
    onSuccess: (data) => {
        const newResult = data.content.map((item) => ({
          ...item,
          serviceCenter: formatCenter(item.serviceCenter),
          serviceDate: formatDate(item.serviceDate),
          serviceCost: formatMoney(item.serviceCost),
        }));
    
        setWarranty(newResult);
        setTotalWarranty(data.totalElements);
      },
  });

  // boi vi co side effect nen dung useMutation (id thay doi, data cung thay doi)
  useEffect(() => {
    getDataWarranty({page: currentPage, customerId: id});
  }, [id, currentPage, pageSize]);


  const exportHandle = async () => {
    try {
      const response = await exportWarranty(id);
      const password = downloadFile(response.data);
      showExportModal(password);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const convertToISO = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const {
    mutate: addDataWarranty,
  } = useMutation({
    mutationFn: ({page, customerId}) =>  addWarrantyData({page,customerId}),
    //sau khi mutate : api thanh cong thi se xu li
    onSuccess: (data) => {
        const newResult = data.content.map((item) => ({
          ...item,
          serviceCenter: formatCenter(item.serviceCenter),
          serviceDate: formatDate(item.serviceDate),
          serviceCost: formatMoney(item.serviceCost),
        }));
    
        setWarranty(newResult);
        setTotalWarranty(data.totalElements);
      },
  });

  const onSubmit = async (formData) => {
    const payload = {
      customerId: id,
      carModel: formData.model,
      licensePlate: formData.license,
      serviceType: formData.type,
      serviceCenter: formData.center,
      serviceDate: convertToISO(formData.date),
      serviceCost: formData.cost,
    };
    try {
      await addWarrantyData(payload);

      setWarranty((prev) => [
        ...prev,
        {
          ...payload,
          serviceCenter: formatCenter(payload.serviceCenter),
          serviceDate: formatDate(payload.serviceDate),
          serviceCost: formatMoney(payload.serviceCost),
        },
      ]);
      toast.success("New information added successfully!");

      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error adding warranty data:", error);
    }
  }

    return {
        warranty,
        isModalOpen,
        dataSource,
        pageSize,
        totalWarranty,
        setCurrentPage,
        setPageSize,
        exportHandle,
        onSubmit

    };
}


export default useWarranty;
