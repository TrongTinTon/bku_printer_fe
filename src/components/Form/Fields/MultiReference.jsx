import React, { memo } from "react";
import { Tooltip } from "antd";
import Reference from "src/components/Form/Reference";
import ServerUrl from "src/constants/ServerUrl";
import "./style.scss";

function MultiReference(props) {
  const { id, mode, parentModule, autoFocus, disabled, value, tooltip, suffixIcon, onChange, fieldInfo, allowClear } =
    props;

  const fieldName = fieldInfo?.name;

  const { value: idValue, label: labelValue, module } = value || {};
  const url = module ? `/erp/listview?module=${module?.name}&cvid=4&page=1&record=${idValue}` : "#";
  const HtmlKey = module ? "a" : "span";
  const tooltipProps = tooltip ? { title: tooltip, placement: "topLeft", zIndex: 2500 } : {};
  const iconModuleSrc = `${ServerUrl.urlSub}assets/icon/${module?.name}.svg`;
  const moduleLabel = module?.label;

  const handleClick = (e) => {
    if (module) {
      e.stopPropagation();
    }
  };

  return mode === "edit" ? (
    <div className="field-edit-group field-ajax-multireference">
      <Reference
        id={id}
        field={fieldName}
        module={parentModule?.name}
        autoFocus={autoFocus}
        disabled={disabled}
        allowClear={allowClear}
        value={value}
        onChange={onChange}
        showSelectModule={false}
      />
    </div>
  ) : (
    <>
      <Tooltip {...tooltipProps}>
        <HtmlKey
          className={`field-multireference-container ${module && "linked"}`}
          target={module ? "_blank" : undefined}
          href={url}
          onClick={handleClick}>
          {labelValue}
        </HtmlKey>
      </Tooltip>
      {suffixIcon && module?.name && (
        <Tooltip title={moduleLabel} zIndex={2500}>
          <img className="icon-module" src={iconModuleSrc} height={20} />
        </Tooltip>
      )}
    </>
  );
}

export default memo(MultiReference);
