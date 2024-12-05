import { memo } from "react";
import { Tabs } from "antd";
import SalaryReport from "./Tabs/SalaryReport";
import EmployeeReport from "./Tabs/EmployeeReport";
import TimekeepingReport from "./Tabs/TimekeepingReport";

function Sale() {
  const items = [
    {
      key: "1",
      label: "Tình hình nhân sự",
      children: <EmployeeReport />,
    },
    // {
    //   key: "2",
    //   label: "Thống kê tuyển dụng",
    //   children: "Thống kê tuyển dụng",
    // },
    {
      key: "3",
      label: "Thống kê chấm công",
      children: <TimekeepingReport />,
    },
    {
      key: "4",
      label: "Thống kê lương",
      children: <SalaryReport />,
    },
    // {
    //   key: "5",
    //   label: "Đánh giá nhân sự",
    //   children: "Đánh giá nhân sự",
    // },
  ];
  return (
    <Tabs
      destroyInactiveTabPane
      className="second-tab"
      tabBarGutter={25}
      defaultActiveKey="1"
      items={items}
      type={"card"}
    />
  );
}

export default memo(Sale);
