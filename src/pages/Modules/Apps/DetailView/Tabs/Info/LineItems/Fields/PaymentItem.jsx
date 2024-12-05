import React, { useState, useLayoutEffect, useRef, useEffect, memo } from "react";
import { Form, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Input from "src/components/Form/Input";
import DatePicker from "src/components/DatePicker";
import appGlobal from "src/global/AppGlobal";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";

function PaymentItem(props) {
  const {
    fieldDay,
    fieldValue,
    payInfo,
    payDayInfo,
    recordData,
    recordPermissions,
    reloadTabInfo,
    form,
    isEditing,
    saveDataRecord,
    typeValue,
  } = props;

  const [mode, setMode] = useState("detail");
  const [saving, setSaving] = useState(false);

  const valueSelect = useRef(null);
  const payValue = +recordData?.[fieldValue]?.value || 0;
  const payDayValue = recordData?.[fieldDay]?.value || null;

  // Permission record
  const recordEditable = recordPermissions?.editable;

  const onEditField = (field) => {
    if (
      isEditing.current ||
      (field === "value" && !payInfo?.editable) ||
      (field === "date" && !payDayInfo?.editable) ||
      !recordEditable
    )
      return;
    valueSelect.current = field;
    isEditing.current = true;
    setMode("edit");
  };

  const onCancel = () => {
    isEditing.current = false;
    form.resetFields([fieldValue, fieldDay]);
    setMode("detail");
  };

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const paymentValue = values?.[fieldValue] || 0;
    const paymentDay = values?.[fieldDay]?.format("YYYY-MM-DD") || null;

    const isChange = paymentValue !== payValue || paymentDay !== payDayValue;

    if (!isChange) {
      onCancel();
      return;
    }

    const data = { [fieldValue]: paymentValue };
    payDayInfo && (data[fieldDay] = paymentDay);

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

  return (
    <tr>
      <td className="td-label">
        {/* Date */}
        <div className="group-label-payment">
          <div className="text-label">{payInfo?.label}</div>
          {payDayInfo &&
            (mode === "detail" ? (
              <div
                className={`text-date ${!payDayValue && "not-date"} ${
                  (!recordEditable || !payDayInfo?.editable) && "disabled"
                }`}
                onClick={() => onEditField("date")}>
                <span>{payDayValue ? appGlobal.convertToServerTime(payDayValue, "DD-MM-YYYY") : "Chưa có ngày"}</span>
                <FaIcon icon="fa-regular fa-calendar" color="#A0AEC0" className="icon-value" />
              </div>
            ) : (
              <Form.Item name={fieldDay} initialValue={payDayValue && dayjs(payDayValue, "YYYY-MM-DD")} noStyle>
                <RenderPaymentDayEdit autoFocus={valueSelect.current === "date"} disabled={saving} />
              </Form.Item>
            ))}
        </div>
      </td>

      {/* Value */}
      <td className={`td-value ${typeValue || "success"}`}>
        <Form.Item name={fieldValue} initialValue={payValue} noStyle>
          {mode === "detail" ? (
            <div
              className={`text-value ${(!recordEditable || !payInfo?.editable) && "disabled"}`}
              onClick={() => onEditField("value")}>
              {typeValue === "error" ? "-" : "+"}
              {appGlobal.formatCurrency(payValue || 0, 2)}
            </div>
          ) : (
            <RenderPaymentEdit autoFocus={valueSelect.current === "value"} disabled={saving} />
          )}
        </Form.Item>

        {/* Button save, cancel */}
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

const RenderPaymentDayEdit = memo(({ id, value, onChange, disabled, autoFocus }) => {
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

const RenderPaymentEdit = memo(({ id, value, onChange, disabled, autoFocus }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    autoFocus && inputRef.current?.select();
  }, []);

  return (
    <div className="field-edit-group">
      <Input
        id={id}
        ref={inputRef}
        className="field-edit-input wrap-left"
        type="numbers"
        formatter={(value) => `${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        precision={2}
        min={0}
        onChange={onChange}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );
});

export default memo(PaymentItem);
