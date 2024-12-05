import { getTimekeepingTops, getTimekeepingStatus, getTimekeepings } from "src/store/module/dashboardAction";
import DualColumnChart from "src/components/Widgets/Chart/WGDualColumnChart";
import RankListVectical from "src/components/Widgets/Chart/WGRankListVectical";
import InfoBoard from "src/components/Widgets/Chart/WGInfoBoard";
import PieDonutChart from "src/components/Widgets/Chart/WGPieDonutChart";
import MultiLineChart from "src/components/Widgets/Chart/WGMultiLineChart";
import RootChart from "src/pages/Home/Feature/RootChart";
import "./style.scss";

function TimekeepingReport() {
  console.log("re-render timekeepingReport");

  return (
    <div className="timekeepingReport-container">
      <div className="grid-status">
        <RootChart
          action={getTimekeepingStatus}
          title={"Tình hình chấm công"}
          showTimeNow="Hôm nay"
          loadOnFirst={true}
          ChartComponent={InfoBoard}
        />
      </div>

      <div className="grid-outdate">
        <RootChart
          title={"Thống kê ngày nghỉ"}
          action={getTimekeepings}
          bodyApi={{ groupBy: "outdate" }}
          color={["#F88537", "#FDD4B9"]}
          precisionTotal={1}
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-overtime">
        <RootChart
          action={getTimekeepings}
          bodyApi={{ groupBy: "overtime" }}
          title={"Thống kê giờ tăng ca"}
          color={["#F9757E", "#FDCFD2"]}
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-travel">
        <RootChart
          action={getTimekeepings}
          bodyApi={{ groupBy: "travel" }}
          title={"Thống kê ngày công tác"}
          color={["#04B9A7", "#A7E6E0"]}
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-deparment">
        <RootChart
          title={"Nghỉ theo phòng ban"}
          action={getTimekeepings}
          color={["#FAAA73", "#F496C5", "#87DB70", "#F9757E", "#ACB8CF", "#649EFF", "#4FCEC1", "#6CCAFF"]}
          bodyApi={{ filterBy: "department", groupBy: "outdate" }}
          showTotalCenter={true}
          positionLegend={"bottom"}
          sizeChart={"large"}
          ChartComponent={PieDonutChart}
        />
      </div>

      <div className="grid-topLate">
        <RootChart
          title={"Nhân viên đi muộn, về sớm"}
          action={getTimekeepingTops}
          bodyApi={{ groupBy: "toplate" }}
          colorFirstSubValue="#F9757E"
          tooltipSubValue="Số lần đi muộn, về sớm"
          ChartComponent={RankListVectical}
        />
      </div>

      <div className="grid-topOutdate">
        <RootChart
          title={"Nhân viên nghỉ nhiều"}
          action={getTimekeepingTops}
          bodyApi={{ groupBy: "topoutdate" }}
          tooltipSubValue="Số ngày nghỉ"
          ChartComponent={RankListVectical}
        />
      </div>

      <div className="grid-topOvertime">
        <RootChart
          title={"Top tăng ca"}
          action={getTimekeepingTops}
          bodyApi={{ groupBy: "topovertime" }}
          tooltipSubValue="Số giờ tăng ca"
          colorCountRow={true}
          ChartComponent={RankListVectical}
        />
      </div>
    </div>
  );
}

export default TimekeepingReport;
