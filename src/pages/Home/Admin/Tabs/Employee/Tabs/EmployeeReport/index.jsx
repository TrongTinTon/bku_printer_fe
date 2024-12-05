import { getEmployeeStatus, getEmployeeChange, getEmployeeFilter } from "src/store/module/dashboardAction";
import InfoBoard from "src/components/Widgets/Chart/WGInfoBoard";
import RootChart from "src/pages/Home/Feature/RootChart";
import DualColumnChart from "src/components/Widgets/Chart/WGDualColumnChart";
import TagBage from "src/components/Widgets/Chart/WGTagBage";
import PieDonutChart from "src/components/Widgets/Chart/WGPieDonutChart";
import "./style.scss";
import appGlobal from "../../../../../../../global/AppGlobal";

function EmployeeReport() {
  console.log("re-render EmployeeReport");

  return (
    <div className="employeeReport-container">
      <div className="grid-status">
        <RootChart
          action={getEmployeeStatus}
          title={"Tình trạng nhân sự"}
          showTimeNow={true}
          loadOnFirst={true}
          ChartComponent={InfoBoard}
        />
      </div>
      <div className="grid-employeeChange">
        <RootChart
          action={getEmployeeChange}
          title={"Biến động nhân sự"}
          color={["#04B9A7", "#A7E6E0"]}
          selectOption={appGlobal.ListDepartments()}
          isGroup={true}
          showTotal={false}
          positionLegend={"top"}
          ChartComponent={DualColumnChart}
        />
      </div>
      <div className="grid-deparment">
        <RootChart
          title={"Nhân sự phòng ban"}
          action={getEmployeeFilter}
          color={["#FAAA73", "#F496C5", "#87DB70", "#F9757E", "#ACB8CF", "#649EFF", "#4FCEC1", "#6CCAFF"]}
          bodyApi={{ filterBy: "department" }}
          showTotalCenter={true}
          positionLegend={"bottom"}
          sizeChart={"large"}
          showTimeNow={true}
          loadOnFirst={true}
          ChartComponent={PieDonutChart}
        />
      </div>

      <div className="grid-tagBage1">
        <RootChart action={getEmployeeFilter} bodyApi={{ filterBy: "TagBage1" }} ChartComponent={TagBage} />
      </div>

      <div className="grid-tagBage2">
        <RootChart action={getEmployeeFilter} bodyApi={{ filterBy: "TagBage2" }} ChartComponent={TagBage} />
      </div>
    </div>
  );
}

export default EmployeeReport;
