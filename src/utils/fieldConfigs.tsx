import { Form, FormInstance, Switch } from "antd";
import { Rule } from "antd/es/form";
import constants from "../constants/index";
type FieldType = "input" | "select" | "date" | "switch" | "custom" | "tel";
export type RoleOption = {
  label: string;
  value: number | string;
};

const roleOptions: RoleOption[] = [
  { label: "IT Suport", value: 9 },
  { label: "Manager", value: 7 },
  { label: "Sales", value: 8},
  { label: "Admin", value: 1 },
];

export interface FormFieldConfig {
  name: string | string[];
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fieldNames?: { label: "label", value: "value" };
  rules?: Rule[];
  options?: { label: string; value: string | number }[];
  render?: (form: FormInstance) => React.ReactNode;
}
export const adminFormFields = (isEditMode: boolean): FormFieldConfig[] => [
  {
    name: isEditMode ? "id" : "fullName",
    label: isEditMode ? "Admin ID" : "Admin Name",
    type: "input",
    placeholder: isEditMode ? undefined : "Enter Admin Name",
    disabled: isEditMode,
    rules: isEditMode
      ? []
      : [{ required: true, message: "Admin name is required" }],
    required: false,
    className: "!bg-transparent font-normal",
  },
  {
    name: ["role","id"],
    label: "Role",
    type: "select",
    rules: [{ required: true, message: "Role is required" }],
    required: false,
    placeholder: "Search to select",
    className: "font-normal",
    options: roleOptions,
    fieldNames: { label: "label", value: "value" },
  },
  {
    name: isEditMode ? "fullName" : "email",
    label: isEditMode ? "Admin Name" : "Email",
    type: "input",
    placeholder: isEditMode ? "Enter Admin Name" : "Enter Email",
    rules: isEditMode
      ? [{ required: true, message: "Admin name is required" }]
      : [
          { required: true, message: "Email is required" },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            message: "Please enter a valid email address",
          },
        ],
    required: false,
    className: "!bg-transparent font-normal",
  },
  {
    name: "departmentName",
    label: "Department",
    type: "select",
    placeholder: "Choose Department",
    options: constants.DEPARTMENT_LIST,
    rules: [{ required: true, message: "Department is required" }],
    required: false,
    className: "font-normal",
  },
  {
    name: isEditMode ? "email" : "dateOfBirth",
    label: isEditMode ? "Email" : "Date of Birth",
    type: isEditMode ? "input" : "date",
    placeholder: isEditMode ? "Select Date" : undefined,
    disabled: isEditMode,
    rules: !isEditMode
      ? [{ required: true, message: "Date of birth is required" }]
      : [
          { required: true, message: "Email is required" },
          {
            type: "email",
            pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            message: "Please enter a valid email address",
          },
        ],
    required: false,
    className: isEditMode ? "!bg-transparent" : "font-normal",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter Phone Number",
    rules: [
      { required: true, message: "Phone number is required" },
      {
        pattern: /^[0-9]{9,15}$/,
        message: "Invalid phone number",
      },
    ],
    required: false,
    className: "font-normal",
  },
  ...(isEditMode
    ? [
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date" as FieldType,
          placeholder: "Select Date",
          rules: [{ required: true, message: "Date of birth is required" }],
          required: false,
          className: "font-normal",
        },
        {
          name: "lastLogin",
          label: "Last Login",
          type: "input" as FieldType,
          disabled: isEditMode,
          className: "!bg-transparent font-normal",
        },
      ]
    : []),
];
