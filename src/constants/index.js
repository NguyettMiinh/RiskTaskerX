
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
  { label: "RISKTASKERX Ho Chi Minh", value: "RISKTASKERX Ho Chi Minh" },
  { label: "RISKTASKERX Ha Noi", value: "RISKTASKERX Ha Noi" },
  { label: "RISKTASKERX Quy Nhon", value: "RISKTASKERX Quy Nhon" },
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
  { title: "Customer ID", dataIndex: "id" },
  { title: "Customer Name", dataIndex: "fullName" },
  { title: "Phone Number", dataIndex: "phoneNumber" },
  { title: "Address", dataIndex: "address" },
  { title: "Email", dataIndex: "email" }
];

const PURCHASE_LIST = [
  { title: "Car model", dataIndex: "carModel" },
  { title: "VIN", dataIndex: "vehicleIdentificationNumber" },
  { title: "Price", dataIndex: "price" },
  { title: "Payment method", dataIndex: "paymentMethod" },
  { title: "Purchase date", dataIndex: "purchaseDate" },
];
const WARRANTY_LIST = [
  { title: "Car model", dataIndex: "carModel" },
  { title: "License Plate", dataIndex: "licensePlate" },
  { title: "Service Type", dataIndex: "serviceType" },
  { title: "Service Center", dataIndex: "serviceCenter" },
  { title: "Service Date", dataIndex: "serviceDate" },
  { title: "Service Cost", dataIndex: "serviceCost" },
  
];
export default {
  MODEL_OPTIONS,
  TYPE_OPTIONS,
  TIER_OPTIONS,
  STATUS_OPTIONS,
  CENTER_OPTIONS,
  CUSTOMER_LIST,
  PURCHASE_LIST,
  WARRANTY_LIST
};
