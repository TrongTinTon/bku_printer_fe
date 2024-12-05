import React, { memo } from "react";
import { Tooltip } from "antd";
import Picklist from "src/components/Form/Fields/Picklist";
import Select from "src/components/Form/Select";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import "./style.scss";

function MultiPicklist(props) {
  const { id, value, mode, allowClear, autoFocus, disabled, onChange, picklistValues, suffixIcon } = props;
  const maxTagCount = 1;

  const renderTooltipContent = () => {
    return (
      <div className="tooltip-content">
        {value?.map((item, index) => {
          return index >= maxTagCount && item ? <span key={index}>{item?.value}</span> : null;
        })}
      </div>
    );
  };

  const renderPicklist = (isMaxCount) => {
    return (
      <div className="field-multipicklist-container">
        {value?.map((item, index) => {
          return isMaxCount ? (
            index < maxTagCount && item ? (
              <Picklist key={index} value={item} />
            ) : null
          ) : (
            <Picklist key={index} value={item} />
          );
        })}
      </div>
    );
  };

  return mode === "edit" ? (
    <div className="field-edit-group">
      <Select
        id={id}
        className="field-ajax-multipicklist"
        customoptions={picklistValues}
        size="large"
        autoFocus={autoFocus}
        defaultOpen={autoFocus}
        allowClear={allowClear}
        disabled={disabled}
        value={value}
        onChange={onChange}
        valuereturn={"array"}
        mode="multiple"
      />
    </div>
  ) : (
    <>
      {!suffixIcon ? (
        <div className="field-multipicklist-container">
          {renderPicklist(true)}
          {value?.length > maxTagCount ? (
            <Tooltip title={renderTooltipContent()} zIndex={2500}>
              <span className="multipicklist-more">+{value?.length - maxTagCount}...</span>
            </Tooltip>
          ) : null}
        </div>
      ) : (
        <>
          <div className="field-multipicklist-container">{renderPicklist(false)}</div>
          {suffixIcon && typeof suffixIcon === "string" && <FaIcon className="icon-value" icon={suffixIcon} />}
        </>
      )}
    </>
  );
}

export default memo(MultiPicklist);
