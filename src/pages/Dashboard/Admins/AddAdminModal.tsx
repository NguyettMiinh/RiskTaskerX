import { Col, Form, Modal, Row, Spin, Switch } from "antd";
import { adminFormFields } from "../../../utils/fieldConfigs";
import renderFormItem from "./RenderFormItem";
import { PageName } from "../../../constants/Variable";
import useUpdateAndAddAdmin from "./hook/useUpdateAndAddAdmin";

const AddAdminModal = () => {
  const {
    handleCancel,
    handleOk,
    roleOption,
    form,
    isActive,
    isEditMode,
    visible,
    loading,
  } = useUpdateAndAddAdmin();

  return (
    <Modal
      title={isEditMode ? PageName.adminDetail : PageName.addNewAdmin}
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
      okText={isEditMode ? PageName.saveChangeText : PageName.addNowText}
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
          validateTrigger={["onChange", "onBlur"]}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {adminFormFields(isEditMode, roleOption).map((field, index) =>
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
                    {isActive ? PageName.activeText : PageName.inactiveText}
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
