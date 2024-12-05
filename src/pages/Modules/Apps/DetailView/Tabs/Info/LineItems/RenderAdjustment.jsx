import React, { useState, memo, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { Form, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Input from "src/components/Form/Input";
import Select from "src/components/Form/Select";
import DatePicker from "src/components/DatePicker";
import appGlobal from "src/global/AppGlobal";
import dayjs from "dayjs";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";

function RenderAdjustment({
  getFieldInfo,
  recordData,
  form,
  saveDataRecord,
  reloadTabInfo,
  isEditing,
  recordPermissions,
}) {
  const [mode, setMode] = useState("detail");
  const [saving, setSaving] = useState(false);

  const valueSelect = useRef(null);
  const adjustmentInfo = getFieldInfo("txtAdjustment");
  const adjustmentDayInfo = getFieldInfo("cf_3251");
  const editable = adjustmentInfo?.editable;
  const editableDay = adjustmentDayInfo?.editable;
  const adjustment = +recordData?.txtAdjustment?.value || 0;
  const adjustmentDay = recordData?.cf_3251?.value || null;

  // Permission record
  const recordEditable = recordPermissions?.editable;
  const isDisabledDay = !editableDay || !recordEditable;
  const isDisabledValue = !editable || !recordEditable;

  // Handle edit
  const onEditField = (field) => {
    const selectionString = window.getSelection().toString();
    if (
      isEditing.current ||
      (field === "value" && !editable) ||
      (field === "date" && !editableDay) ||
      !recordEditable ||
      selectionString
    )
      return;
    valueSelect.current = field;
    isEditing.current = true;
    setMode("edit");
  };

  // Handle cancel
  const onCancel = () => {
    isEditing.current = false;
    form.resetFields(["txtAdjustment", "cf_3251"]);
    setMode("detail");
  };

  // Handle save
  const onFinish = async () => {
    const values = form.getFieldsValue();
    const txtAdjustment = values?.txtAdjustment || 0;
    const cf_3251 = values?.cf_3251?.format("YYYY-MM-DD") || null;

    const isChange = txtAdjustment !== adjustment || cf_3251 !== adjustmentDay;

    if (!isChange) {
      onCancel();
      return;
    }

    const data = { txtAdjustment: txtAdjustment };
    adjustmentDayInfo && (data.cf_3251 = cf_3251);

    setSaving(true);
    try {
      await saveDataRecord(data);
    } finally {
      isEditing.current = false;
      setSaving(false);
      reloadTabInfo();
      setMode("detail");
    }
  };

  return isDisabledValue && adjustment === 0 ? null : (
    <tr>
      <td className="td-label">
        <div className="group-label-payment">
          <div className="text-label">{adjustmentInfo?.label}</div>
          {adjustmentDayInfo &&
            (mode === "detail" ? (
              <div
                className={`text-date ${!adjustmentDay && "not-date"} ${isDisabledDay && "disabled"}`}
                onClick={() => onEditField("date")}>
                <span>
                  {adjustmentDay ? appGlobal.convertToServerTime(adjustmentDay, "DD-MM-YYYY") : "Chưa có ngày"}
                </span>
                <FaIcon icon="fa-regular fa-calendar" className="icon-value" color="#A0AEC0" />
              </div>
            ) : (
              <Form.Item name="cf_3251" noStyle initialValue={adjustmentDay && dayjs(adjustmentDay, "YYYY-MM-DD")}>
                <RenderAdjustmentDate autoFocus={valueSelect.current === "date"} disabled={saving} />
              </Form.Item>
            ))}
        </div>
      </td>
      <td className={`td-value ${adjustment >= 0 ? "success" : "error"}`}>
        <Form.Item name="txtAdjustment" initialValue={adjustment} noStyle>
          {mode === "detail" ? (
            <div className={`text-value ${isDisabledValue && "disabled"}`} onClick={() => onEditField("value")}>
              {adjustment >= 0 && "+"}
              {appGlobal.formatCurrency(adjustment, 2)}
            </div>
          ) : (
            <RenderAdjustmentEdit autoFocus={valueSelect.current === "value"} disabled={saving} />
          )}
        </Form.Item>

        {mode !== "detail" && (
          <div className="group-btn-ajax">
            <Button className="btn-cancel" onClick={onCancel} disabled={saving}>
              <FaIcon icon={"fa-xmark"} />
            </Button>
            <Button className="btn-save" onClick={onFinish} disabled={saving}>
              {saving ? <LoadingOutlined style={{ fontSize: 16 }} spin /> : <FaIcon icon={"fa-check"} />}
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}

const RenderAdjustmentDate = memo(({ id, onChange, value, disabled, autoFocus }) => {
  useLayoutEffect(() => {
    setTimeout(() => {
      autoFocus && openDatePicker();
    }, 50);
  }, []);

  const openDatePicker = () => {
    if (isOpenPicker()) return;
    const inputElement = document.getElementById(id);
    inputElement?.click();
  };

  const isOpenPicker = () => {
    const pickerPopup = document.querySelector(`.date-picker-popup-${id}`);
    const hasClassHidden = pickerPopup ? pickerPopup?.classList.contains("ant-picker-dropdown-hidden") : true;
    return !hasClassHidden;
  };

  return (
    <div className="field-edit-group field-adjustment-date-group">
      <DatePicker
        id={id}
        className="date-picker-custom field-edit-input"
        format={"DD-MM-YYYY"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placement={"bottomLeft"}
        suffixIcon={false}
        popupClassName={`date-picker-popup-${id}`}
      />
      <div className="suffix-icon has-clicked" onClick={openDatePicker}>
        <FaIcon icon={"fa-regular fa-calendar"} color="#A0AEC0" />
      </div>
    </div>
  );
});

const RenderAdjustmentEdit = memo(({ id, onChange, value, disabled, autoFocus }) => {
  const converValue = value * (value > 0 ? 1 : -1);
  const type = useRef(value >= 0 ? "plus" : "minus");
  const inputRef = useRef(null);

  useEffect(() => {
    changeColorInput(type.current);
    autoFocus && inputRef.current?.select();
  }, []);

  // Update value input
  const updateValue = useCallback(
    (newValue, typeValue = type.current) => onChange(newValue * (typeValue === "plus" ? 1 : -1)),
    [onChange]
  );

  // Change type input
  const onChangeType = useCallback(
    (typeValue) => {
      type.current = typeValue;
      changeColorInput(typeValue);
      updateValue(converValue, typeValue);
    },
    [updateValue, converValue]
  );

  // Change value input
  const onChangeInput = useCallback((valueInput) => updateValue(valueInput), [updateValue]);

  // Change color input
  const changeColorInput = useCallback(
    (typeValue) => {
      const inputElement = document.getElementById(id);
      if (inputElement)
        inputElement.style.setProperty("color", typeValue === "plus" ? "#33BA35" : "#F63A46", "important");
    },
    [id]
  );

  return (
    <div className="field-edit-group field-adjustment-group">
      <Select
        className="field-select-type-adjustment"
        size="large"
        allowClear={false}
        showSearch={false}
        closeafterselect={"true"}
        defaultValue={value >= 0 ? "plus" : "minus"}
        popupMatchSelectWidth={false}
        onChange={onChangeType}
        disabled={disabled}
        options={[
          { value: "minus", label: <FaIcon icon={"fa-minus"} fontSize={12} color="#F63A46" /> },
          { value: "plus", label: <FaIcon icon={"fa-plus"} fontSize={12} color="#33BA35" /> },
        ]}
      />
      <Input
        id={id}
        ref={inputRef}
        className="field-edit-input wrap-left"
        type="numbers"
        formatter={(value) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        precision={2}
        min={0}
        onChange={onChangeInput}
        value={converValue}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );
});

export default memo(RenderAdjustment);
