import React, { memo } from "react";
import Input from "src/components/Form/Input";
import "./style.scss";

function String(props) {
  const { value, mode } = props;

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input className="field-edit-input" {...props} />
    </div>
  ) : (
    <>
      <div className="field-string-container">{value}</div>
    </>
  );
}

export default memo(String);
