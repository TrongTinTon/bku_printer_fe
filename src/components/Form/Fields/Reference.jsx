import React, { memo } from "react";
import { Tooltip } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Reference from "src/components/Form/Reference";
import "./style.scss";

function ReferenceField(props) {
  const { id, value, parentModule, tooltip, mode, fieldInfo, onChange, allowClear, disabled, autoFocus, suffixIcon } =
    props;

  const fieldName = fieldInfo?.name;
  const { value: idValue, label: labelValue } = value || {};

  const url = value?.module ? `/erp/listview?module=${value?.module?.name}&cvid=4&page=1&record=${idValue}` : "#";
  const isDetailView = value?.isDetailView;
  const HtmlKey = value?.module && isDetailView ? "a" : "span";
  const tooltipProps = tooltip ? { title: tooltip, placement: "topLeft", zIndex: 2500 } : {};

  const handleClick = (e) => {
    if (value?.module && isDetailView) {
      e.stopPropagation();
    }
  };

  return mode === "edit" ? (
    <div className="field-edit-group field-ajax-reference">
      <Reference
        id={id}
        field={fieldName}
        module={parentModule?.name}
        autoFocus={autoFocus}
        disabled={disabled}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
      />
    </div>
  ) : (
    <>
      <Tooltip {...tooltipProps}>
        <HtmlKey
          className={`field-reference-container ${value?.module && isDetailView && "linked"}`}
          target={value?.module ? "_blank" : undefined}
          href={url}
          title={labelValue}
          onClick={handleClick}>
          {labelValue}
        </HtmlKey>
      </Tooltip>
      {suffixIcon && <FaIcon className="icon-value" icon={suffixIcon} />}
    </>
  );
}

export default memo(ReferenceField);
