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
  Modal,
  Collapse,
} from "antd";
import { useEffect, useState } from "react";
import { getPermissions, getRoles, editRoles } from "@/services/roleService";
import { RightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const { Panel } = Collapse;
function DetailRole() {
  const [categories, setCategories] = useState([]);
  const [childCategory, setChildCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formEdit, setFormEdit] = useState({
    name: "",
    isActive: "false",
    permissionId: [],
  });
  const [isError, setIsError] = useState("");
  const id = useSelector((state) => state.user.id);

  //lay permission hien thi len UIUI
  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setCategories(response.data.results);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  //lay detail de so sanh voi permission
  const fetchDetail = async () => {
    try {
      const response = await getRoles(id);
      //luu gia tri vao form de edit
      setFormEdit({
        name: response.data.results.name || "",
        isActive: response.data.results.isActive ?? false,
        permissionId:
          response.data.results.permissions?.map((item) => item.id) || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

 
  const handlePermissions = (category) => {
    if (category.name === "Admin & Role Management") {
      setChildCategory(category.children);
    } else {
      setSelectedCategory(category);
    }
  };

  const checkAll =
    selectedCategory?.children?.length > 0 &&
    selectedCategory.children.every((item) =>
      formEdit.permissionId.includes(item.id)
    );

  const navigate = useNavigate();
  function handleCancel() {
    navigate("/layout/role-list");
  }

  const handleSave = async () => {
    try {
      await editRoles(
        id,
        formEdit.name,
        formEdit.isActive,
        formEdit.permissionId
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
  function handleCheckAll(e) {
    const checked = e.target.checked;
    // id cua tung categories
    const allIds = selectedCategory?.children.map((child) => child.id);
    console.log(allIds);
    //loai bo trung lap voi formId
    const updatedPermissions = checked
      ?  Array.from(new Set([...formEdit.permissionId, ...allIds]))
      : formEdit.permissionId.filter((id) => !allIds.includes(id));

    setFormEdit({
      ...formEdit,
      permissionId: updatedPermissions,
    });
  }

  function handleCheckBox(e, child) {
    const checked = e.target.checked;
    const updatedPermissions = checked
      ? [...formEdit.permissionId, child.id]
      : formEdit.permissionId.filter((id) => id !== child.id);

    setFormEdit({
      ...formEdit,
      permissionId: updatedPermissions,
    });
  }

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
          <Col span={12} offset={2}>
            <Typography.Text strong className="text-[16px]">
              Status
            </Typography.Text>

            <div className="pt-[12px]">
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
        </Row>
        <Row>
          <Col span={8}>
            <div className="border border-[#eee] rounded-[10px]">
              <div className="flex justify-between border-b border-[#eee] px-5 py-[18px] bg-[#EBEAFA] text-[#6055F2] font-medium rounded-t-[10px]">
                Management Categories
              </div>
              {categories.map((item) => {
                if (item.name === "Admin & Role Management") {
                  return (
                    <Collapse
                      key={item.id}
                      expandIcon={({ isActive }) => (
                        <RightOutlined
                          rotate={isActive ? 90 : 0}
                          style={{ color: "#6055F2" }}
                        />
                      )}
                      expandIconPosition="end"
                    >
                      <Panel
                        header={
                          <div onClick={() => handlePermissions(item)}>
                            {item.name}
                          </div>
                        }
                        key={item.id}
                      >
                        {childCategory.map((child) => (
                          <div key={child.id}>
                            <div
                              className={`flex justify-between px-5 py-5 cursor-pointer ${
                                selectedCategory?.id === item.id
                                  ? "bg-[#F5F5F5]"
                                  : "bg-white"
                              }`}
                              onClick={() => handlePermissions(child)}
                            >
                              {child.name}
                              <RightOutlined className="text-[#6055F2]" />
                            </div>
                          </div>
                        ))}
                      </Panel>
                    </Collapse>
                  );
                }

                return (
                  <div key={item.id}>
                    <div
                      className={`flex justify-between px-5 py-5 border-b border-[#eee] cursor-pointer ${
                        selectedCategory?.id === item.id
                          ? "bg-[#F5F5F5]"
                          : "bg-white"
                      }`}
                      onClick={() => handlePermissions(item)}
                    >
                      {item.name}
                      <RightOutlined style={{ color: "#6055F2" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
          <Col span={14} offset={2}>
            <div>
              <Card
                title={
                  <div className="flex justify-between">
                    <div>Permissions</div>
                    <div>
                      <Checkbox
                        checked={checkAll}
                        onChange={(e) => {
                          handleCheckAll(e);
                        }}
                        className="custom-checkbox"
                      >
                        Select All
                      </Checkbox>
                    </div>
                  </div>
                }
                styles={{ header: { background: "#EBEAFA" } }}
                className="w-full"
              >
                {selectedCategory?.children?.length > 0 ? (
                  <>
                    {selectedCategory.children.map((child) => (
                      <div key={child.id} className="pb-[10px]">
                        <Checkbox
                          checked={formEdit.permissionId.includes(child.id)}
                          onChange={(e) => {
                            handleCheckBox(e, child);
                          }}
                        >
                          {" "}
                          {child.name}
                        </Checkbox>
                      </div>
                    ))}
                  </>
                ) : (
                  <div>No permissions available</div>
                )}
              </Card>
            </div>
            <div className="flex justify-end mt-2">
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
      </div>
    </div>
  );
}

export default DetailRole;
