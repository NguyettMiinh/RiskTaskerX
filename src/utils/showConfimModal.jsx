import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

export const showConfirmModal = (isActive, onConfirm, name) => {
    Modal.confirm({
      icon: null,
      content: (
        <div style={{ textAlign: "center" }}>
          <ExclamationCircleFilled
            style={{ color: "#FAAD14", fontSize: "40px", marginBottom: "10px" }}
          />
          <div style={{ fontSize: "15px" }}>
            {isActive
              ? `Are you sure you want to activate this ${name}?`
              : `Are you sure you want to deactivate this ${name}?`}
          </div>
        </div>
      ),
      okText: "Confirm",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          backgroundColor: "#6055F2",
          borderColor: "#6055F2",
          color: "#fff",
        },
      },
      onOk: onConfirm,
    });
  };
  