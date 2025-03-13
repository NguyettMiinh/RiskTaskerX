import React from 'react'
import {Button} from "antd";

const ButtonComponent = ({ 
  className,
  content, 
  type = 'primary', 
  size = 'large', 
  disabled = false, 
  loading = false, 
  onClick, 
  icon, 
  shape = 'default', 
  danger = false,
  block = false,
  htmlType = 'button'
}) => {
  return (
    <Button 
      className={className}
      block={block}
      type={type}
      size={size}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      icon={icon}
      shape={shape}
      danger={danger}
      htmlType= {htmlType}
    >
      {content}
    </Button>
  );
};

export default ButtonComponent;
