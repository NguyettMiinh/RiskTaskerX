
const MODEL_OPTIONS = [
  { label: "Hyundai Elantra 2023", value: "Hyundai Elantra 2023" },
  { label: "Hyundai Tucson 2024", value: "Hyundai Tucson 2024" },
  { label: "Hyundai Santa Fe 2023", value: "Hyundai Santa Fe 2023" },
  { label: "Hyundai Ioniq 5 2024", value: "Hyundai Ioniq 5 2024" },
  { label: "Hyundai Palisade 2024", value: "Hyundai Palisade 2024" },
];

const TYPE_OPTIONS = [
  { label: "Oil Change", value: "Oil Change" },
  { label: "Battery Replacement", value: "Battery Replacement" },
  { label: "Brake Inspection", value: "Brake Inspection" },
  { label: "Software Update", value: "Software Update" },
  { label: "AC Repair", value: "AC Repair" },
];

const CENTER_OPTIONS = [
  { label: "RISKTASKERX Ho Chi Minh", value: "Ho_Chi_Minh" },
  { label: "RISKTASKERX Ha Noi", value: "Ha_Noi" },
  { label: "RISKTASKERX Quy Nhon", value: "Quy_Nhon" },
];

const TIER_OPTIONS = [
  { label: "Diamond", value: "Diamond" },
  { label: "Gold", value: "Gold" },
  { label: "Silver", value: "Silver" },
  { label: "Bronze", value: "Bronze" },
];
const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const CUSTOMER_LIST = [
  { title: "Customer ID", dataIndex: "id", align: 'center', },
  { title: "Customer Name", dataIndex: "fullName", align: 'center', },
  { title: "Phone Number", dataIndex: "phoneNumber", align: 'center', },
  { title: "Address", dataIndex: "address", align: 'center', },
  { title: "Email", dataIndex: "email", align: 'center', }
];

const PURCHASE_LIST = [
  { title: "Car Model", dataIndex: "carModel", width: 150},
  { title: "VIN", dataIndex: "vehicleIdentificationNumber",  width: 150 },
  { title: "Price", dataIndex: "price",  width: 150 },
  { title: "Payment options", dataIndex: "paymentMethod",  width: 150 },
  { title: "Purchase date", dataIndex: "purchaseDate",  width: 150 },
];
const WARRANTY_LIST = [
  { title: "Car Model", dataIndex: "carModel" },
  { title: "License Plate", dataIndex: "licensePlate" },
  { title: "Service Type", dataIndex: "serviceType" },
  { title: "Service Center", dataIndex: "serviceCenter" },
  { title: "Service Date", dataIndex: "serviceDate" },
  { title: "Service Cost", dataIndex: "serviceCost" },
  
];
const DEPARTMENT_LIST = [
  { label: "Customer", value: "customer" },
  { label: "Operations", value: "operations" },
  { label: "Sales", value: "sales" },
  { label: "IT", value: "it" },
];

const ROLE_LIST = [
  { label: "Customer Manager", value: "customerManager" },
  { label: "Operations Manager", value: "operationsManager" },
  { label: "Sales Manager", value: "salesManager" },
  { label: "System Admin", value: "systemAdmin" },
];


export default {
  MODEL_OPTIONS,
  TYPE_OPTIONS,
  TIER_OPTIONS,
  STATUS_OPTIONS,
  CENTER_OPTIONS,
  CUSTOMER_LIST,
  PURCHASE_LIST,
  WARRANTY_LIST,
  DEPARTMENT_LIST,
  ROLE_LIST
};
