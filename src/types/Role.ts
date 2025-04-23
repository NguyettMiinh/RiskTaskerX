//state role: xac dinh xem api trả về gì , dinh nghia kieu du lieu rieng
export interface Role {
  id: string | number;
  name: string;
  isActive: boolean;
  updateAt?: string;
  permissions: Category[];
}

//tabel ke thua role: interface: ko co method, ke thua dc nhiu interface
export interface RoleTable extends Role {
  key: string | number;
}

export interface RoleForm {
  search: string;
  status: boolean[];
  sortField: string;
  sortOrder: "ASC" | "DESC";
  pageSize: number;
  totalRoles: number;
}

export interface RoleSearchFilter {
  page: number;
  size: number;
  searchKey: string | null;
  isActive: boolean[] | null;
  sortKey: string | "updateAt";
  sortBy: "ASC" | "DESC";
}
export interface Category {
  id:  number;
  key: string;
  name: string;
  orderNumber: number;
  parentId:  number | null;
  children: Category[]; // kieu de quy, kieu tu tham chieu
};

export interface ActionForm {
    id?: number | string,
    name: string;
    isActive: boolean;
    permissions: number[];
    isError?: string;
}
