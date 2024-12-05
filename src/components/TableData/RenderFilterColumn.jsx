/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { ConditionFilter } from "../../constants/ConditionFilter";
import { Button, Form } from "antd";
import Select from "src/components/Form/Select";
import RenderFilterInput from "src/components/FilterModule/RenderFilterInput";

function RenderFilterColumn(props) {
  const { close, filters, columnInfo, searchColumnRef, handleSubmitFilter } = props;
  const userInfo = useSelector((state) => state.account?.userInfo);
  const formRef = useRef(null);

  const fieldType = columnInfo?.type?.name;
  const optionsHideValue = ["empty", "not empty"];
  const init = filters?.find((item) => item.name === columnInfo.column);
  let valueEmpty = "";

  useEffect(() => {
    if (init) {
      formRef.current?.setFieldsValue({ value: init?.value, operator: init?.operator });
    }
  }, []);

  useEffect(() => {
    setDropdownDisplay(true);
  }, [Math.random()]);

  const options = ConditionFilter(fieldType);

  const setDropdownDisplay = (isShow) => {
    const dropdown = document.querySelector(`#${columnInfo.column}`);
    const parentDropdown = dropdown?.parentElement.parentElement;
    parentDropdown ? (parentDropdown.style.display = isShow ? "" : "none") : null;
  };

  const onConditionChange = (value) => {
    if (value === "empty" || value === "not empty") {
      formRef.current?.setFieldsValue({ value: valueEmpty });
    } else {
      searchColumnRef.current?.focus();
    }
  };

  const handleClose = () => {
    close();
  };

  const handleReset = () => {
    formRef.current?.setFieldsValue({ value: valueEmpty, operator: init?.operator || options.operatorDefault });
  };

  const handleConfirm = async (values, isRemove) => {
    setDropdownDisplay(false);
    close();
    values.name = columnInfo.column;
    isRemove && handleReset();
    await handleSubmitFilter(values, isRemove);
  };

  const renderValueWithFieldType = () => {
    return (
      <RenderFilterInput ref={searchColumnRef} fieldType={fieldType} columnInfo={columnInfo} userInfo={userInfo} />
    );
  };

  return (
    <>
      <div id={columnInfo.column} className={"filter-dropdown-container"}>
        <div className="header-dropdown">
          <span className="title">{columnInfo.label}</span>
          <div className="btn-cancel-filter" onClick={handleClose}>
            <FaIcon icon="fa-xmark" />
          </div>
          <div className="btn-reset-filter" onClick={handleReset} />
        </div>
        <Form
          ref={formRef}
          className="form-condition"
          name={`control-${columnInfo.column}-ref`}
          onFinish={handleConfirm}>
          <Form.Item name="operator" initialValue={init?.operator || options?.operatorDefault}>
            <Select
              className="filter-condition"
              style={{ minWidth: 250, maxWidth: 290 }}
              size={"large"}
              allowClear={false}
              showSearch={true}
              options={options?.operator}
              onChange={onConditionChange}
            />
          </Form.Item>

          <Form.Item shouldUpdate className="form-item-value" noStyle>
            {({ getFieldValue }) => {
              const isShowInput = getFieldValue("operator") && !optionsHideValue.includes(getFieldValue("operator"));
              return (
                <Form.Item style={{ display: isShowInput ? "" : "none" }} name="value" initialValue={init?.value}>
                  {renderValueWithFieldType(isShowInput)}
                </Form.Item>
              );
            }}
          </Form.Item>

          <div className="footer-dropdown">
            <div className={"close-dropdown"} onClick={() => handleConfirm({}, true)}>
              Xóa bỏ
            </div>
            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const isDisableConfirm =
                  (!getFieldValue("value") || !getFieldValue("value")?.length > 0) &&
                  !optionsHideValue.includes(getFieldValue("operator"));

                return (
                  <Button className="confirm" htmlType="submit" disabled={isDisableConfirm}>
                    Áp dụng
                  </Button>
                );
              }}
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="mask-filter" onClick={handleClose} />
    </>
  );
}

export default RenderFilterColumn;
