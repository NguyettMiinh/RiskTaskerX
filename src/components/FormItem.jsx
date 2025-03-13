import React from 'react';
import { Form } from 'antd';
import { Controller } from "react-hook-form";

const FormItem = ({
    validateStatus,
    help,
    name,
    control,
    render,
}) => {
  return (
    <>
        <Form.Item
            validateStatus={validateStatus}
            help={help}
          >
            <Controller
              name= {name}
              control={control}
              render={({ field }) => render(field)}
            />
          </Form.Item>
    
    </>
  )
}

export default FormItem;
