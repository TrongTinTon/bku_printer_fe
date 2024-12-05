import { getSalary, getSalaryLevel } from "src/store/module/dashboardAction";
import DualColumnChart from "src/components/Widgets/Chart/WGDualColumnChart";
import RootChart from "src/pages/Home/Feature/RootChart";
import DetailSalary from "./DetailSalary";
import PieDonutChart from "src/components/Widgets/Chart/WGPieDonutChart";
import "./style.scss";

function SalaryReport() {
  console.log("re-render salary");

  return (
    <div className="salaryReport-container">
      <div className="grid-salary">
        <RootChart
          action={getSalary}
          title={"Thống kê lương"}
          color={["#F9757E", "#FDCFD2"]}
          selectOption={[
            { value: "Tất cả", label: "Thời gian" },
            { value: "deparment", label: "Phòng ban" },
          ]}
          contentDetail={DetailSalary}
          isGroup={true}
          modalStyle={{ width: "100%" }}
          ChartComponent={DualColumnChart}
        />
      </div>

      <div className="grid-salaryLevel">
        <RootChart
          title={"Mức lương (LCB + TL)"}
          action={getSalaryLevel}
          color={["#899ABA", "#2275FF", "#04B9A7", "#F9757E"]}
          positionLegend={"right"}
          ChartComponent={PieDonutChart}
          showTimeNow={true}
          loadOnFirst={true}
        />
      </div>

      <div className="grid-salaryAverage">
        <RootChart
          action={getSalary}
          bodyApi={{ mode: "average" }}
          title={"Mức lương bình quân"}
          color={["#04B9A7", "#A7E6E0"]}
          selectOption={[
            { value: "Tất cả", label: "Phòng ban" },
            { value: "position", label: "Chức vụ" },
          ]}
          showTotal={false}
          positionLegend={"top"}
          isGroup={true}
          ChartComponent={DualColumnChart}
        />
      </div>
    </div>
  );
}

export default SalaryReport;
