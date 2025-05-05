import Breadcrumbs from "@components/ui/Breadcrumbs";
import {
  Button,
  Checkbox,
  Input,
  Switch,
  Typography,
  Row,
  Col,
  Collapse,
} from "antd";
import "../../../assets/styles/role.css";
import useDetailRole from "./hook/useDetailRole";
const { Panel } = Collapse;
function DetailRole() {
  const {
    editForm,
    categories,
    setEditForm,
    handleSave,
    toggleActive,
    handleCheckBox,
    handleAllCheckBox,
    handleCancel,
  } = useDetailRole();
  const { name, isActive, permissions, isError } = editForm;
  return (
    <div className="flex justify-start min-h-screen p-[10px]">
      <div className="w-full bg-white p-[33px] rounded-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
        <div className="mb-[20px]">
          <Breadcrumbs />
          <div className="text-[20px] font-bold pt-2">Role Details</div>
        </div>

        <Row className="pb-[30px]">
          <Col span={8}>
            <div className="mb-[10px]">
              <Typography.Text strong className="text-[16px]">
                Role Name
              </Typography.Text>
            </div>

            <Input
              placeholder="Enter role name"
              size="large"
              className="text-14px"
              status={isError ? "error" : ""}
              value={name}
              onChange={(e) => {
                setEditForm({ ...editForm, name: e.target.value });
              }}
            />
            {isError && <div className="text-red-500">{isError}</div>}
          </Col>
          <Col span={6} offset={2}>
            <Typography.Text strong className="text-[16px]">
              Status
            </Typography.Text>

            <div className="pt-[16px]">
              <Switch
                checked={isActive}
                onChange={toggleActive}
                style={{
                  backgroundColor: isActive ? "#6055F2" : "#d9d9d9",
                  marginRight: "5px",
                }}
              />
              <span>{editForm?.isActive ? "Active" : "Inactive"}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex justify-end mt-[10px] pt-[20px]">
              <Button className="mt-2 mr-2" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className="mt-2 bg-[#6055F2] text-white"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Collapse>
              <Panel
                header={
                  <div className="text-base text-[#6055F2]">
                    Management Categories
                  </div>
                }
                key="header"
                showArrow={false}
                collapsible="disabled"
                style={{ background: "#EBEAFA" }}
              />
              {categories?.map((item) => {
                const allIds = item?.children?.map((child) => child.id) || [];

                const checkAll = allIds.every((id) =>
                  permissions.includes(id)
                );

                return (
                  <Panel header={item.name} key={item.id}>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Checkbox
                          checked={checkAll}
                          onChange={(e) => {
                            handleAllCheckBox(e.target.checked, allIds);
                          }}
                        >
                          Select All
                        </Checkbox>
                      </Col>
                      {item?.children.map((child) => {
                        return (
                          <Col key={child.id} span={24}>
                            <Checkbox
                              checked={editForm.permissions.includes(child.id)}
                              onChange={(e) => {
                                handleCheckBox(child.id, e.target.checked);
                              }}
                            >
                              {child.name}
                            </Checkbox>
                          </Col>
                        );
                      })}
                    </Row>
                  </Panel>
                );
              })}
            </Collapse>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DetailRole;
