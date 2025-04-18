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
import dayjs from "dayjs";
import { Admin, AdminUpdateRequest } from "../../../types/Admin";
import InputFormComponent from "@components/ui/InputFormComponent";
import { adminFormFields } from "../../../utils/fieldConfigs";
import renderFormItem from "./RenderFormItem";
import { toast } from "react-toastify";

type optionFilter = {
  label: string;
  value: string;
};
interface AddAdminModalProps {
  onSuccess: () => void;
}
const AddAdminModal: React.FC<AddAdminModalProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const visible = useModalStore((state) => state.visible);
  const isEditMode = useModalStore((state) => state.isEditMode);
  const editingUserId = useModalStore((state) => state.editingUserId);
  const setVisible = useModalStore((state) => state.setVisible);
  const setEditingUserId = useModalStore((state) => state.setEditingUserId);
  const isActive = Form.useWatch("isActive", form);

  const handleCancel = () => {
    setVisible(false);
    setEditingUserId(null);
    form.resetFields();
  };

  const handleUpdateAdmin = useCallback(
    async (values: AdminUpdateRequest) => {
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).toISOString(),
        role: {
          id: values.role.id,
          createAt: null,
          updateAt: null,
          name: null,
          isActive: null,
        },
        lastLogin: dayjs().toISOString(),
        name: values.fullName,
      };
      console.log(payload);
      delete (payload as any).lastLogin;
      await adminService.updateAdmin(payload);
      toast.success("Changes have been saved successfully");
      onSuccess();
    },
    [isActive, form.getFieldValue]
  );
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          handleUpdateAdmin(values);
        } else {
          console.log("Thêm dữ liệu mới:", values);
        }
        setVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const showAdminDetail = async () => {
    try {
      if (editingUserId) {
        setLoading(true);
        const data = await adminService.getAdminById(editingUserId);
        if (data && data.httpStatus == "OK") {
          const formattedDate = dayjs(data.results.dateOfBirth);
          form.setFieldsValue({
            ...data.results,
            dateOfBirth: formattedDate,
            lastLogin: dayjs(data.results.lastLogin).format("HH:mm DD-MM-YYYY"),
          });
        } else {
          console.log("Lỗi");
        }
      } else {
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && isEditMode) {
      showAdminDetail();
    }
  }, [visible, isEditMode]);

  const onFinish = (values: any) => {
    console.log("Form submitted with values: ", values);
  };
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
        }
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
                    <Switch style={{background:  "rgb(96, 85, 242)"}}/>
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
