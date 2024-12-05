import React from "react";
import { TimePicker as TimePickerCustom } from "antd";
import locale from "src/components/DatePicker/locale/vi";
import dayjs from "dayjs";
import "./style.scss";

function TimePicker(props) {
  const format = "HH:mm:ss";
  const now = dayjs();
  const defaultValue = dayjs(now, format);

  return (
    <TimePickerCustom
      locale={locale}
      className="time-picker-custom"
      defaultValue={defaultValue}
      placeholder="Chọn giờ"
      format={format}
      {...props}
    />
  );
}

export default TimePicker;
