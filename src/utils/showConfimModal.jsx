import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

export const showConfirmModal = ( {onConfirm, name, action}) => {
    Modal.confirm({
      icon: null,
      content: (
        <div style={{ textAlign: "center" }}>
          <ExclamationCircleFilled
            style={{ color: "#FAAD14", fontSize: "40px", marginBottom: "10px" }}
          />
          <div className="text-[15px]">
            {`Are you sure you want to ${action} this ${name}?`}
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
  