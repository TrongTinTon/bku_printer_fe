import React, { memo } from "react";
import CheckBox from "src/components/CheckBox";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

function Boolean(props) {
  const { id, value, mode, onChange, checked, disabled } = props;

  return mode === "edit" ? (
    <div className="field-edit-group">
      <CheckBox
        id={id}
        className="checkbox-custom field-edit-input"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        label={checked ? "Có" : "Không"}
      />
    </div>
  ) : (
    <>
      <div className="field-boolean-container">
        <FaIcon icon={value ? "fa-check" : "fa-xmark"} />
        {value ? "Có" : "Không"}
      </div>
      <FaIcon className="icon-value" icon={"fa-regular fa-circle-check"} />
    </>
  );
}

export default memo(Boolean);
