export interface Customer {
  id: string;
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string ;
  isActive: boolean;
  tier: string;
  dateOfBirth: string;
}

export interface CustomerTable extends Customer {
  key: string | number;
}

export interface CustomerForm {
  tiers: string[];
  status: boolean[];
  pageSize: number;
  totalCustomers: number;
}

export interface CustomerInput {
  page?: number;
  size?: number;
  searchKey?: string | null;
  sortKey?: string;
  sortBy?: "ASC" | "DESC";
}

export interface GetCustomer
  extends CustomerInput{
  tier: string[];
  isActive: boolean[];
}


export interface CustomerDetail extends CustomerInput {
  customerId: string | number;
}

export interface Warranty {
  customerId: string | number;
  carModel: string;
  licensePlate: string;
  serviceType: string;
  serviceCenter: string;
  serviceDate: string;
  serviceCost: string | number;
}

