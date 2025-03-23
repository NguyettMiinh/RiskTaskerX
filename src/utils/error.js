import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const handleError = (error,message) => {
    console.log(error);
    if (isAxiosError(error) && error.status === 403) {
        toast.error("Vui lòng xác thực email trước khi sử dụng chức năng này");
        return;
      }
}