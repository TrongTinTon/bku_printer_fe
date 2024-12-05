/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useLayoutEffect, useRef } from "react";
import DatePicker from "src/components/DatePicker";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import "./style.scss";

function Date(props) {
  const { id, value, mode, onChange, autoFocus, disabled } = props;

  const convertDate = value ? dayjs(value).format("DD-MM-YYYY") : "";

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
    const pickerPopup = document.querySelector(`.date-picker-popup-${id}`);
    const hasClassHidden = pickerPopup ? pickerPopup?.classList.contains("ant-picker-dropdown-hidden") : true;
    return !hasClassHidden;
  };

  return mode === "edit" ? (
    <div className="field-edit-group">
      <DatePicker
        id={id}
        className="date-picker-custom field-edit-input"
        format={"DD-MM-YYYY"}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
        suffixIcon={false}
        popupClassName={`date-picker-popup-${id}`}
      />
      <div className="suffix-icon has-clicked" onClick={openDatePicker}>
        <FaIcon icon={"fa-regular fa-calendar"} color="#A0AEC0" />
      </div>
    </div>
  ) : (
    <>
      <div className="field-date-container">{convertDate}</div>
      <FaIcon className="icon-value" icon={"fa-regular fa-calendar"} />
    </>
  );
}

export default memo(Date);
