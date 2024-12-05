import {
  getLeads,
  getCountList,
  getLeadDemand,
  getLeadSource,
  getAccountReview,
  getAccountTopQuotes,
  getAccountTopSO,
} from "src/store/module/dashboardAction";
import ColumnLineChart from "src/components/Widgets/Chart/WGColumnLineChart";
import PieDonutChart from "src/components/Widgets/Chart/WGPieDonutChart";
import RoseChart from "src/components/Widgets/Chart/WGRoseChart";
import RankListVectical from "src/components/Widgets/Chart/WGRankListVectical";
import ProcessChart from "../../../../../../../components/Widgets/Chart/WGProcessChart";
import RootChart from "src/pages/Home/Feature/RootChart";
import "./style.scss";

function AccountReport() {
  console.log("re-render account");
  return (
    <div className="accountReport-container">
      <div className="grid-leads">
        <RootChart
          module="Leads"
          action={getLeads}
          title="Tiềm năng"
          color={["#2275FF", "#899ABA", "#F9757E"]}
          showDiffItem={false}
          showTotalCenter={true}
          positionLegend={"right"}
          colorTotalCenter={"#04B9A7"}
          ChartComponent={RoseChart}
        />
      </div>

      <div className="grid-leadDemand">
        <RootChart
          module="Leads"
          action={getLeadDemand}
          title={"Nhu cầu tiềm năng"}
          color={["#899ABA", "#E2E8F0", "#4EBAFE", "#9AF0E7"]}
          showDiffItem={false}
          positionLegend={"right"}
          ChartComponent={PieDonutChart}
        />
      </div>

      <div className="grid-leadSource">
        <RootChart
          module="Leads"
          action={getLeadSource}
          title={"Nguồn tiềm năng"}
          showDiffItem={true}
          ChartComponent={ProcessChart}
        />
      </div>

      <div className="grid-account">
        <RootChart
          module="Accounts"
          action={getCountList}
          title={"Khách hàng"}
          color={["#2275FF", "#B2CFFF"]}
          ChartComponent={ColumnLineChart}
        />
      </div>

      <div className="grid-accountRate">
        <RootChart
          module="Accounts"
          action={getAccountReview}
          title={"Đánh giá khách hàng"}
          showTotalCenter={false}
          positionLegend={"right"}
          colorTotalCenter={"#04B9A7"}
          showDiffItem={true}
          color={["#899ABA", "#E2E8F0", "#FDE1AE", "#F9757E"]}
          ChartComponent={RoseChart}
        />
      </div>

      <div className="grid-quotesAccount">
        <RootChart
          title={"Khách hỏi giá nhiều nhất"}
          action={getAccountTopQuotes}
          subTitleIcon="fa-regular fa-user"
          colorFirstValue="#A0AEC0"
          colorFirstSubValue="#04B9A7"
          tooltipSubValue="Thành công / tổng"
          ChartComponent={RankListVectical}
        />
      </div>

      <div className="grid-salesAccount">
        <RootChart
          title={"Khách doanh cao số nhất"}
          action={getAccountTopSO}
          colorCountRow={true}
          subTitleIcon="fa-regular fa-user"
          colorFirstValue="#33BA35"
          colorFirstSubValue="#04B9A7"
          tooltipSubValue="% / tổng"
          ChartComponent={RankListVectical}
        />
      </div>
    </div>
  );
}

export default AccountReport;
