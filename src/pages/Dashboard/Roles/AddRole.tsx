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
import useAddRole from "./hook/useAddRole";
const { Panel } = Collapse;

function AddRole() {
  const {
    addForm,
    categories,
    setAddForm,
    handleAdd,
    toggleActive,
    handleCheckBox,
    handleAllCheckBox,
    handleCancel,
  } = useAddRole();
  const { name, isActive, permissions, isError } = addForm;
  return (
    <div className="flex justify-start min-h-screen p-[10px]">
      <div className="w-full bg-white p-[33px] rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.15)]">
        {/* Breadcrumb & Title */}
        <div className="mb-5">
          <Breadcrumbs />
          <div className="text-[20px] font-bold pt-2">Add New Role</div>
        </div>

        <Row className="pb-[30px]">
          <Col span={8}>
            <div className="pb-[10px]">
              <Typography.Text strong className="text-[16px]">
                Role Name
              </Typography.Text>
            </div>
            <Input
              placeholder="Enter role name"
              size="large"
              value={name}
              status={isError ? "error" : ""}
              onChange={(e) => {
                setAddForm({ ...addForm, name: e.target.value });
              }}
            />
            
            {isError && <div style={{ color: "red" }}>{isError}</div>}
          </Col>
          <Col span={6} offset={2}>
            <Typography.Text strong className="text-[16px]">
              Status
            </Typography.Text>
            <div className="pt-[16px]">
              <Switch
                className="text-[16px]"
                checked={isActive}
                onChange={toggleActive}
                style={{
                  backgroundColor: isActive ? "#6055F2" : "#d9d9d9",
                  marginRight: "5px",
                }}
              />
              <span>{isActive ? "Active" : "Inactive"}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex justify-end mt-[10px] pt-[20px]">
              <Button className="mt-[10px] mr-[10px]" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className="mt-2.5 bg-[#6055F2] text-white"
                onClick={handleAdd}
              >
                Add Now
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
                // allId la mag id cua tat ca children trong item
                const allIds = item?.children?.map((child) => child.id) || [];
                // nay chi kiem tra khi nhan tung checkbox con, neu co toan bo id thi true
                const checkAll = allIds.every((id) => permissions.includes(id));
                // con neu nhan lien selectAll thi checked = true, them toan bo allIds vao permissions
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
                              checked={addForm.permissions.includes(child.id)}
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

export default AddRole;
