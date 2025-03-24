import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const handleError = (error,message) => {
    console.log(error);
    if (isAxiosError(error) && error.status === 500) {
        toast.error("Internal Server Error");
        return;
      }
}