import {  useMutation } from "@tanstack/react-query";
import { getWarranty } from "@/services/customerService";

export const {
    data: dataWarranty,
    isSuccess,
    isLoading,
    mutate: getDataWarranty,
  } = useMutation({
    mutationFn: ({page, customerId}) =>  getWarranty({page,customerId}),
  });

  return {
    getDataWarranty,
    dataWarranty,
    isSuccess,
    isLoading,
  };
