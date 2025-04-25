import { Col, Form, Input, Select, DatePicker } from "antd";
import { FormFieldConfig } from "../../../utils/fieldConfigs";
import { PageName } from "../../../constants/Variable";

const RenderFormItem = (field: FormFieldConfig, index: number) => {
  const commonProps = {
    name: field.name,
    label: field.label,
    rules: field.rules,
    required: field.required ?? false,
    colon: false,
    validateStatus: field.validateStatus,
    help: field.help,
  };

  let inputComponent;
  switch (field.type) {
    case "select":
      inputComponent = (
        <Select
          options={field.options}
          placeholder={field.placeholder}
          fieldNames={field.fieldNames}
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
          format={PageName.formatDate}
          disabledDate={field.disabledDate}
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

export default RenderFormItem;
