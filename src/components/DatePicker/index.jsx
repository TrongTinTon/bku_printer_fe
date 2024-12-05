import React, { forwardRef } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "antd";
import locale from "src/components/DatePicker/locale/vi";
import "./style.scss";

const { RangePicker } = DatePicker;

const DatePickerCustom = forwardRef((props, ref) => {
  const DateOrRange = props.type === "RangePicker" ? RangePicker : DatePicker;

  return (
    <DateOrRange
      ref={ref}
      className="date-picker-custom"
      locale={locale}
      format={"DD/MM/YYYY"}
      suffixIcon={<FaIcon icon="fa-regular fa-calendar" />}
      prevIcon={<FaIcon icon="fa-angle-left" />}
      nextIcon={<FaIcon icon="fa-angle-right" />}
      superNextIcon={<FaIcon icon="fa-angles-right" />}
      superPrevIcon={<FaIcon icon="fa-angles-left" />}
      {...props}
    />
  );
});

export default DatePickerCustom;
