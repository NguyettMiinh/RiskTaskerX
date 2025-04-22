import Breadcrumbs from "@components/ui/Breadcrumbs";
import {
  Button,
  Card,
  Checkbox,
  Input,
  Switch,
  Typography,
  Row,
  Col,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { getRoles, editRoles } from "@/services/roleService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { usePermissions } from "@components/hook/usePermissions";
import { useQuery } from "@tanstack/react-query";
import "../../../assets/styles/role.css";
const { Panel } = Collapse;
function DetailRole() {
  const [formEdit, setFormEdit] = useState({
    name: "",
    isActive: "false",
    permissionId: [],
  });
  const { name, isActive, permissionId } = formEdit;
  const [isError, setIsError] = useState("");
  const id = useSelector((state) => state.user.id);

  const { data: categoriesData } = usePermissions();
  const categories = categoriesData?.data.results;

  const { data: roleData } = useQuery({
    queryKey: ["role", id],
    queryFn: () => getRoles(id),
  });
  //luc dau roleData undefined, set lien vao form se bi loi
  // chi goi khi co roleDate
  useEffect(() => {
    if (roleData?.data?.results) {
      const role = roleData.data.results;
      setFormEdit({
        name: role.name || "",
        isActive: role.isActive ?? true,
        permissionId: role.permissions?.map((item) => item.id) || [],
      });
    }
  }, [roleData]);

  const navigate = useNavigate();
  function handleCancel() {
    navigate("/layout/role-list");
  }

  const handleSave = async () => {
    try {
      await editRoles(
        id,
        name,
        isActive,
        permissionId
      );
      
      navigate("/layout/role-list");
      toast.success("Changes have been saved successfully!");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "role-name-exists") {
        setIsError("This role name is already taken.");
      }
      if (message === "invalid-valid-name") {
        setIsError("Role Name is required.");
      }
    }
  };

  const handleAllCheckBox = (checked, all) => {
    if (checked) {
      setFormEdit((prev) => ({
        ...prev,
        permissionId: [...prev.permissionId, ...all],
      }));
    } else {
      setFormEdit((prev) => ({
        ...prev,
        permissionId: prev.permissionId.filter((id) => !all.includes(id)),
      }));
    }
  };
  const handleCheckBox = (value, checked) => {
    setFormEdit((prev) => ({
      ...prev,
      permissionId: checked
        ? [...prev.permissionId, value] 
        : prev.permissionId.filter((item) => item !== value), 
    }));
  };

  return (
    <div className="flex justify-start min-h-screen p-[10px]">
      <div className="w-full bg-white p-[50px] rounded-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
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
              value={formEdit.name}
              onChange={(e) => {
                setFormEdit({ ...formEdit, name: e.target.value });
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
                checked={formEdit.isActive}
                onChange={(checked) =>
                  setFormEdit({ ...formEdit, isActive: checked })
                }
                style={{
                  backgroundColor: formEdit.isActive ? "#6055F2" : "#d9d9d9",
                  marginRight: "5px",
                }}
              />
              <span>{formEdit?.isActive ? "Active" : "Inactive"}</span>
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
                  permissionId.includes(id)
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
                              checked={formEdit.permissionId.includes(child.id)}
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
