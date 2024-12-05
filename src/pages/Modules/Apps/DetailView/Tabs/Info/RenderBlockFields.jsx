import React, { useRef, useState } from "react";
import { Skeleton } from "antd";
import RenderFieldWithType from "./RenderFieldWithType";

function RenderBlockFields(props) {
  const { fields, getFieldInfo, isLoading, getDataRecord } = props;

  const data = getDataRecord();
  const permissions = data?.permission || {};
  const recordData = useRef({});

  recordData.current = data?.record || {};

  const renderSkeletonValueField = () => {
    return (
      <div className="item-value-skeleton">
        <Skeleton.Input active={true} block={true} style={{ height: 28, borderRadius: 8 }} />
      </div>
    );
  };

  const renderField = (field, index) => {
    const fieldName = field?.name;
    const fieldInfo = getFieldInfo(fieldName);
    const fieldValue = recordData?.current?.[fieldName];
    const displayType = field?.displaytype;
    const isEditable = fieldInfo?.editable && permissions?.editable && fieldInfo?.isAjaxEditable;
    const isDisabled = displayType === "2" || !isEditable || field?.uitype === "72";
    const mandatory = fieldInfo?.mandatory;

    return (
      <div className={`group-field ${isDisabled && "disabled"}`} key={index}>
        <div className="item-label">
          <span>
            {mandatory && <span className="icon-required">*</span>}
            {field?.label}
          </span>
        </div>
        {isLoading ? (
          renderSkeletonValueField()
        ) : (
          <div id={`${fieldName}Value`} className="group-item-value">
            <RenderFieldWithType
              fieldInfo={fieldInfo}
              fieldValue={fieldValue}
              recordData={recordData?.current}
              isDisabled={isDisabled}
              {...props}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="block-container">
      <div className="block-row">
        {fields?.map((field, index) => {
          return renderField(field, index);
        })}
        <div className="group-field" />
      </div>
    </div>
  );
}

export default RenderBlockFields;
