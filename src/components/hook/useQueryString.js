import { useSearchParams } from "react-router";
export const useQueryString = () => {
      const [searchParams] = useSearchParams();
      const searchParamsObject = Object.fromEntries([...searchParams]);
      return searchParamsObject;
}