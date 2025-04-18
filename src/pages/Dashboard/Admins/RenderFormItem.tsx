import { Row, Col, Form, Input, Select, DatePicker, FormInstance } from "antd";
import { adminFormFields, FormFieldConfig } from "../../../utils/fieldConfigs";

const renderFormItem = (
  field: FormFieldConfig,
  index: number,
) => {
  const commonProps = {
    name: field.name,
    label: field.label,
    rules: field.rules,
    required: field.required ?? false,
    colon: false,
  };

  let inputComponent;

  switch (field.type) {
    case "select":
      inputComponent = (
        <Select
          options={field.options}
          placeholder={field.placeholder}
          optionFilterProp="label"
          filterSort={(a, b) => a.label.localeCompare(b.label)}
        />
      );
      break;
    case "date":
      inputComponent = (
        <DatePicker
          style={{ width: "100%" }}
          placeholder={field.placeholder}
          format={"DD/MM/YYYY"}
          className={field.className}
        />
      );
      break;
    default:
      inputComponent = (
        <Input
          placeholder={field.placeholder}
          disabled={field.disabled}
          className={field.className}
        />
      );
  }

  return (
    <Col span={12} key={index}>
      <Form.Item {...commonProps}>{inputComponent}</Form.Item>
    </Col>
  );
};

export default renderFormItem;
