/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useLayoutEffect, useRef } from "react";
import TimePicker from "src/components/TimePicker";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import "./style.scss";

function Time(props) {
  const { id, value, mode, onChange, autoFocus, disabled } = props;

  const detailDate = value ? dayjs(value, "HH:mm").format("HH:mm") : "";

  useLayoutEffect(() => {
    setTimeout(() => {
      autoFocus && mode === "edit" && openDatePicker();
    }, 50);
  }, []);

  const openDatePicker = () => {
    if (isOpenPicker()) return;
    const inputElement = document.getElementById(id);
    inputElement?.click();
  };

  const isOpenPicker = () => {
    const pickerPopup = document.querySelector(`.time-picker-popup-${id}`);
    const hasClassHidden = pickerPopup ? pickerPopup?.classList.contains("ant-picker-dropdown-hidden") : true;
    return !hasClassHidden;
  };

  return mode === "edit" ? (
    <div className="field-edit-group">
      <TimePicker
        id={id}
        value={value}
        className="time-picker-custom field-edit-input"
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
        format={"HH:mm"}
        changeOnBlur={true}
        suffixIcon={<></>}
        popupClassName={`time-picker-popup-${id}`}
      />
      <div className="suffix-icon has-clicked" onClick={openDatePicker}>
        <FaIcon icon={"fa-regular fa-clock"} color="#A0AEC0" />
      </div>
    </div>
  ) : (
    <>
      <div className="field-time-container">{detailDate}</div>
      <FaIcon className="icon-value" icon={"fa-regular fa-clock"} />
    </>
  );
}

export default memo(Time);
