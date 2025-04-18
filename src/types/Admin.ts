export interface Admin {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | undefined;
  profileImg: string | undefined;
  isActive: boolean | undefined;
  role: Role;
  createAt: string | undefined;
  updateAt: string | undefined;
  lastLogin: string | undefined;
  departmentName: string | undefined;
  dateOfBirth: string | undefined;
}

export interface AdminSearchAndFilterRequest {
  sortKey: string;
  filters: {
    searchKey?: string;
    departmentName?: string[];
    isActive?: boolean[];
  };
  page: number;
  size: number;
  sortBy: "ASC" | "DESC";
}

export interface PagingResult<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: any[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: any;
  empty: boolean;
}

export interface APIResponse<T> {
  results: T;
  message: string;
  httpStatus: string;
}

export interface Role {
  createAt: string | undefined | null;
  updateAt: string | undefined | null;
  id: number | undefined;
  name: string | undefined| null;
  isActive: boolean | undefined | null;
}
type SortOrder = "ascend" | "descend" | null;
export type FieldColumn = {
  title: string;
  dataIndex: string | string[];
  align: "left" | "center" | "right";
  responsive?: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
  render?: (text: string, record: Admin) => React.ReactNode;
  sorter?: boolean;
  sortOrder?: SortOrder;
};

export interface APIResponseExport {
  response: string[];
  fileName: string;
  password: string;
}

export const columnAdminFields: FieldColumn[] = [
  { title: "Admin ID", dataIndex: "id", align: "left" },
  { title: "Admin Name", dataIndex: "fullName", align: "left" },
  { title: "Email", dataIndex: "email", align: "left" },
  { title: "Role Name", dataIndex: ["role", "name"], align: "left" },
  { title: "Department", dataIndex: "departmentName", align: "left" },
  {
    title: "Last Login",
    dataIndex: "lastLogin",
    align: "left",
    sorter: true,
  },
];

export interface FormData {
  role: string | undefined;
  name: string | undefined;
  email: string | undefined;
  department: string | undefined;
  phone: string | undefined;
  dateOfBirth: string | undefined;
  status: string | undefined;
}

export interface AdminUpdateRequest {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | undefined;
  isActive: boolean | undefined;
  role: Role;
  departmentName: string | undefined;
  dateOfBirth: string | undefined;
}
