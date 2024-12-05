/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Button } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { SwapRightOutlined } from "@ant-design/icons";
import { setDashboardDay } from "../../../store/module/reducers";
import { isArray, isEqual } from "lodash";
import DatePickerCustom from "../../../components/DatePicker";
import $ from "jquery";

function DateSelect() {
  const dispatch = useDispatch();
  const startOfMonth = dayjs(dayjs().startOf("month")).format("DD/MM/YYYY");
  const endOfMonth = dayjs(dayjs().endOf("month")).format("DD/MM/YYYY");
  const startOfMonthLY = dayjs().subtract(1, "year").startOf("month").format("DD/MM/YYYY");
  const endOfMonthLY = dayjs().subtract(1, "year").endOf("month").format("DD/MM/YYYY");

  const timeNows = useSelector((state) => state.module.dashboard.timeNow);
  const timeDiffs = useSelector((state) => state.module.dashboard.timeDiff);

  const defaultNow = { label: "Tháng này", value: [startOfMonth, endOfMonth] };
  const defaultLast = { label: "Cùng kỳ", value: [startOfMonthLY, endOfMonthLY] };

  const [optionNow, setOptionNow] = useState(timeNows || defaultNow);
  const [optionLast, setOptionLast] = useState(timeDiffs || defaultLast);

  useEffect(() => {
    dispatch(setDashboardDay({ timeNow: optionNow, timeDiff: optionLast }));
  }, []);

  const handleOpenDate = (open) => {
    if (!open) {
      dispatch(setDashboardDay({ timeNow: optionNow, timeDiff: optionLast }));
      $("#optionDate .ant-picker-focused").removeClass("ant-picker-focused");
    }
  };

  const handleChangeOptionNow = (dates, dateStrings) => {
    const checkOption = rangePresetsNow.filter((item) => isEqual(item.value, dates));
    const labelNow = checkOption.length > 0 ? checkOption[0].label : [dateStrings[0], dateStrings[1]];

    setOptionNow({ label: labelNow, value: [dateStrings[0], dateStrings[1]] });
    setOptionLast({
      label: "Cùng kỳ",
      value: [
        dayjs(dates[0]).subtract(1, "year").format("DD/MM/YYYY"),
        dayjs(dates[1]).subtract(1, "year").format("DD/MM/YYYY"),
      ],
    });
  };

  const handleChangeOptionLast = (dates, dateStrings) => {
    const checkOption = rangePresetsLast.filter((item) => isEqual(item.value, dates));
    const labelLast = checkOption.length > 0 ? checkOption[0].label : [dateStrings[0], dateStrings[1]];
    setOptionLast({ label: labelLast, value: [dateStrings[0], dateStrings[1]] });
  };

  const formatDayToRange = (array) => {
    if (array.length > 0) {
      return [dayjs(array[0], "DD/MM/YYYY"), dayjs(array[1], "DD/MM/YYYY")];
    }
  };

  const rangePresetsNow = [
    {
      label: "Tuần này",
      value: [dayjs().startOf("week"), dayjs().endOf("week")],
    },
    {
      label: "Tháng trước",
      value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")],
    },
    {
      label: "Tháng này",
      value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
      label: "Quý này",
      value: [dayjs().startOf("quarter"), dayjs().endOf("quarter")],
    },
    {
      label: "Năm trước",
      value: [dayjs().subtract(1, "year").startOf("year"), dayjs().subtract(1, "year").endOf("year")],
    },
    {
      label: "Năm này",
      value: [dayjs().startOf("year"), dayjs().endOf("year")],
    },
    {
      label: "6 tháng đầu năm",
      value: [dayjs().startOf("year").month(0), dayjs().startOf("year").month(5).endOf("month")],
    },
    {
      label: "6 tháng cuối năm",
      value: [dayjs().startOf("year").month(6), dayjs().startOf("year").month(11).endOf("month")],
    },
  ];

  const rangePresetsLast = [
    {
      label: "Tuần trước",
      value: [dayjs().subtract(1, "week").startOf("week"), dayjs().subtract(1, "week").endOf("week")],
    },
    {
      label: "Tháng trước",
      value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")],
    },
    {
      label: "Quý trước",
      value: [dayjs().subtract(1, "quarter").startOf("quarter"), dayjs().subtract(1, "quarter").endOf("quarter")],
    },
    {
      label: "Năm trước",
      value: [dayjs().subtract(1, "year").startOf("year"), dayjs().subtract(1, "year").endOf("year")],
    },
  ];
  const renderOptionLabel = (data) => {
    if (isArray(data)) {
      return (
        <div className="label-group">
          {data[0]}
          <span className="range-separator">
            <SwapRightOutlined />
          </span>
          {data[1]}
        </div>
      );
    } else {
      return data;
    }
  };
  const renderButtonReload = (
    <Button className="btn-reload">
      <FaIcon icon="fa-rotate-right" />
    </Button>
  );
  return (
    <div className="flex-group">
      <div className="right-tab">
        <div className="title-option">
          <span className="option-label">{renderOptionLabel(optionNow.label)}</span>
          <span className="separator">so với</span>
          <span className="option-label">{renderOptionLabel(optionLast.label)}</span>
        </div>
        <div id="optionDate">
          <DatePickerCustom
            type="RangePicker"
            allowClear={false}
            inputReadOnly={true}
            presets={rangePresetsNow}
            defaultValue={formatDayToRange(optionNow.value)}
            suffixIcon={<></>}
            onChange={handleChangeOptionNow}
            onOpenChange={handleOpenDate}
          />
          <span className="separator">so với</span>
          <DatePickerCustom
            type="RangePicker"
            allowClear={false}
            inputReadOnly={true}
            presets={rangePresetsLast}
            value={formatDayToRange(optionLast.value)}
            defaultValue={formatDayToRange(optionLast.value)}
            suffixIcon={<></>}
            onChange={handleChangeOptionLast}
            onOpenChange={handleOpenDate}
          />
        </div>
      </div>
      <div>{renderButtonReload}</div>
    </div>
  );
}

export default DateSelect;
