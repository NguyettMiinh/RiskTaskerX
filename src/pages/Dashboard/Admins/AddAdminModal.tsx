import SelectComponent from "@components/ui/SelectComponent";
import { useModalStore } from "../../../utils/modalStore";
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Switch,
} from "antd";
import React from "react";
import constants from "../../../constants";
import dayjs from "dayjs";

const AddAdminModal = () => {
  const { isOpen, closeModal } = useModalStore();
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("✅ Form values:", values);
      closeModal();
    } catch (err) {
      console.log("❌ Validation failed:", err);
    }
  };
  console.log(isOpen);

  return (
    <Modal
      title="Add New Admin"
      className="font-bold"
      open={isOpen}
      onCancel={closeModal}
      onOk={handleOk}
      okText="Add Now"
      centered
      width={800}
      style={{ height: "auto", marginLeft: "75px", top: "30px" }}
    >
      <Form form={form} layout="vertical" className="[&_.ant-form-item]:mb-4 font-medium">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            <Form.Item name="firstName" label="Role" className="">
              <Select
                size="middle"
                placeholder="Search to Select"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
                  {
                    value: "1",
                    label: "Not Identified",
                  },
                  {
                    value: "2",
                    label: "Closed",
                  },
                  {
                    value: "3",
                    label: "Communicated",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="name" label="Admin Name" rules={[{}]}>
              <Input placeholder="Enter Admin Name" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Enter Email" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Switch defaultChecked onChange={() => ({})} style={{}} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="department" label="Department" rules={[{}]}>
              <Select
                size="middle"
                placeholder="Choose Department"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
                  {
                    value: "1",
                    label: "Not Identified",
                  },
                  {
                    value: "2",
                    label: "Closed",
                  },
                  {
                    value: "3",
                    label: "Communicated",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number">
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Date Of Birth">
              <DatePicker
                className="font-normal"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                defaultValue={dayjs()}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default AddAdminModal;
