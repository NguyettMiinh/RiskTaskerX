import React from 'react'
import {Button as Btn} from "antd";
const Button = ({content}) => {
  return (
    <div>
       <Btn
            type="primary"
            htmlType="submit"
            block
            className="btn-sign-in"
            >
            {content}
        </Btn>
    </div>
  )
}

export default Button;
