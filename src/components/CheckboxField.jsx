import { Checkbox } from "antd";
import React from 'react';

const CheckboxField = ({field, className, children}) => {
    const { name, value } = field;
  return (
    <Checkbox className={className} {...field} checked={value} name={name} >
            {children}
    </Checkbox>
  );
}

export default CheckboxField;

