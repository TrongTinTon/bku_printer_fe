import React, { forwardRef } from "react";
import { Input as AntdIput, InputNumber } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

const Input = forwardRef((props, ref) => {
  const { Search, TextArea } = AntdIput;

  switch (props.type) {
    case "password": {
      return <AntdIput.Password ref={ref} {...props} />;
      break;
    }
    case "textarea": {
      return <TextArea ref={ref} {...props} />;
      break;
    }
    case "search": {
      return <Search ref={ref} enterButton={<FaIcon icon="fa-magnifying-glass" />} {...props} />;
      break;
    }
    case "numbers": {
      return <InputNumber ref={ref} {...props} />;
      break;
    }
    default: {
      return <AntdIput ref={ref} {...props} />;
    }
  }
});

export default Input;
