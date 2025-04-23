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
  Spin,
  Switch,
} from "antd";
import constants from "../../../constants/index";
import { useCallback, useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import dayjs, { Dayjs } from "dayjs";
import { Admin, AdminUpdateRequest } from "../../../types/Admin";
import InputFormComponent from "@components/ui/InputFormComponent";
import { adminFormFields } from "../../../utils/fieldConfigs";
import renderFormItem from "./RenderFormItem";
import { toast } from "react-toastify";
import useAdmin from "./hook/useAdmin";
interface AddAdminModalProps {
  onSuccess: () => void;
}
const AddAdminModal: React.FC<AddAdminModalProps> = ({ onSuccess }) => {
  const {
    handleCancel,
    handleOk,
    loading,
    isEditMode,
    isActive,
    visible,
    form,
    onFinish
  } = useAdmin();
  return (
    <Modal
      title={isEditMode ? "Admin Accound Details" : "Add New Admin"}
      className="font-bold"
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{
        style: {
          background: "rgb(96, 85, 242)",
        },
      }}
      destroyOnClose={true}
      okText={isEditMode ? "Save Changes" : "Add Now"}
      centered
      width={800}
      style={{ height: "auto", marginLeft: "75px", top: "30px" }}
    >
      {loading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          layout="vertical"
          className="[&_.ant-form-item]:mb-2 font-medium text-[21px]"
          initialValues={{ isActive: true }}
          onFinish={onFinish}
          validateTrigger={["onChange", "onBlur"]}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {adminFormFields(isEditMode).map((field, index) =>
              renderFormItem(field, index)
            )}
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Form.Item label="Status" style={{ marginBottom: 0 }}>
                <div className="flex font-normal -mt-3">
                  <Form.Item name="isActive" valuePropName="checked" noStyle>
                    <Switch
                      style={{ background: isActive ? "rgb(96, 85, 242)" : "" }}
                    />
                  </Form.Item>
                  <span className="ml-2">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};
export default AddAdminModal;
