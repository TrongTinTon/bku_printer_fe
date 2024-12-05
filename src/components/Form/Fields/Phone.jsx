import React, { memo } from "react";
import Input from "src/components/Form/Input";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

function Phone(props) {
  const { value, mode } = props;

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input className="field-edit-input" {...props} />
      <div className="suffix-icon">
        <FaIcon icon={"fa-mobile-screen-button"} color="#A0AEC0" />
      </div>
    </div>
  ) : (
    <>
      <div className="field-string-container">{value}</div>
      <FaIcon className="icon-value" icon={"fa-mobile-screen-button"} />
    </>
  );
}

export default memo(Phone);
