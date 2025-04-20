import { useQuery } from "@tanstack/react-query";
import { getWarranty} from "@/services/customerService";

export const useWarranty = () => {
    return useQuery({queryKey: ['warranty'], queryFn: () => getWarranty()});

}

