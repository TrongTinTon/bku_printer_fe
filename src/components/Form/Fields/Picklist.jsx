import React, { memo, useRef } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Select from "src/components/Form/Select";
import "./style.scss";

function Picklist(props) {
  const { id, value, mode, onChange, allowClear, disabled, autoFocus, suffixIcon, picklistValues } = props;

  const selectRef = useRef(null);

  const color1 = value?.picklistColor?.color;
  const color2 = value?.picklistColor?.color2;
  const hasColors = color1 && color2;

  const styles = {
    background: hasColors ? `linear-gradient(310deg, ${color2}, ${color1})` : "#F3F5F9",
    color: hasColors ? "#fff" : "#2e3f5c",
  };

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Select
        id={id}
        selectref={selectRef}
        className="field-ajax-picklist"
        customoptions={picklistValues}
        size="large"
        autoFocus={autoFocus}
        defaultOpen={autoFocus}
        allowClear={allowClear}
        disabled={disabled}
        onChange={onChange}
        value={value?.value}
        valuereturn={"object"}
        closeafterselect={"true"}
      />
    </div>
  ) : (
    <>
      <div className="field-picklist-container">
        {value?.value && <span style={styles}>{value?.title || value?.value}</span>}
      </div>
      {suffixIcon && <FaIcon className="icon-value" icon={suffixIcon} />}
    </>
  );
}

export default memo(Picklist);
