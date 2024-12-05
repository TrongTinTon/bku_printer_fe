import React, { memo } from "react";
import Input from "src/components/Form/Input";
import "./style.scss";

function Integer(props) {
  const { value, mode, onChange, id, disabled, autoFocus } = props;

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input
        id={id}
        className="field-edit-input"
        type="numbers"
        autoFocus={autoFocus}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  ) : (
    <>
      <div className="field-integer-container">{value}</div>
    </>
  );
}

export default memo(Integer);
