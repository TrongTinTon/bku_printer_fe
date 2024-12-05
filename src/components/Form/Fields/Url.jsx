import React, { memo } from "react";
import Input from "src/components/Form/Input";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

function Url(props) {
  const { value, mode } = props;

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Input className="field-edit-input" {...props} />
      <div className="suffix-icon">
        <FaIcon icon={"fa-brands fa-edge"} color="#A0AEC0" />
      </div>
    </div>
  ) : (
    <>
      <div className="field-url-container">{value}</div>
      <FaIcon className="icon-value" icon={"fa-brands fa-edge"} />
    </>
  );
}

export default memo(Url);
