import {
  getCountList,
  getInvoiceRevenue,
  getGrossProfit,
  getInvoiceBalance,
  getPOBalance,
  getProductPriceStock,
} from "src/store/module/dashboardAction";
import DualColumnChart from "src/components/Widgets/Chart/WGDualColumnChart";
import MultiLineChart from "src/components/Widgets/Chart/WGMultiLineChart";
import RootChart from "src/pages/Home/Feature/RootChart";
import OneBarChart from "src/components/Widgets/Chart/WGOneBarChart";
import RankListHorizal from "src/components/Widgets/Chart/WGRankListHorizal";
import DetailGrossProfit from "./DetailGrossProfit";
import DetailInvoiceBalance from "./DetailInvoiceBalance";
import DetailPOBalance from "./DetailPOBalance";
import "./style.scss";

function Accounting() {
  console.log("render-Accounting");
  return (
    <div className="accountingReport-container">
      <div className="grid-sales">
        <RootChart
          module="SalesOrder"
          action={getCountList}
          bodyApi={{ columnSort: "total" }}
          color={["#2275FF", "#B2CFFF"]}
          title="Doanh số bán hàng"
          isGroup={true}
          ChartComponent={DualColumnChart}
        />
      </div>
      <div className="grid-grossProfit">
        <RootChart
          title={"Lợi nhuận gộp"}
          action={getGrossProfit}
          isGroup={true}
          color={["#04B9A7", "#A7E6E0"]}
          ChartComponent={DualColumnChart}
          contentDetail={DetailGrossProfit}
          showTimeContent={true}
        />
      </div>
      <div className="grid-invoiceRevenue">
        <RootChart
          title={"Doanh thu sau thuế"}
          action={getInvoiceRevenue}
          isGroup={true}
          color={["#54CB33", "#C3EDB8"]}
          ChartComponent={DualColumnChart}
          selectOption={[
            { value: "Tất cả", label: "Tất cả" },
            { value: "saleorder", label: "Doanh số" },
          ]}
        />
      </div>
      <div className="grid-invoiceBalance">
        <RootChart
          title={"Nợ phải thu"}
          action={getInvoiceBalance}
          loadOnFirst={true}
          bageLabel={"hóa đơn"}
          color={["#F9757E", "#A0AEC0"]}
          showLegend={false}
          ChartComponent={OneBarChart}
          contentDetail={DetailInvoiceBalance}
        />
      </div>

      <div className="grid-POBalance">
        <RootChart
          title={"Nợ phải trả"}
          action={getPOBalance}
          loadOnFirst={true}
          bageLabel={"đặt hàng"}
          color={["#F9757E", "#A0AEC0"]}
          showLegend={false}
          ChartComponent={OneBarChart}
          contentDetail={DetailPOBalance}
        />
      </div>

      <div className="grid-productPrice">
        <RootChart
          title={"Giá trị hàng tồn"}
          action={getProductPriceStock}
          loadOnFirst={true}
          bageLabel={"tồn kho"}
          color={["#A0AEC0", "#2275FF", "#F9757E", "#04B9A7"]}
          showLegend={true}
          ChartComponent={OneBarChart}
        />
      </div>

      <div className="grid-topRevenue">
        <RootChart
          action={getInvoiceRevenue}
          bodyApi={{ groupBy: "user" }}
          title={"Top doanh thu"}
          showUnit={true}
          showCup={true}
          showStar={false}
          ChartComponent={RankListHorizal}
        />
      </div>

      <div className="grid-loan">
        <RootChart
          title={"Khoản vay nhân viên"}
          action={getCountList}
          module={"Loan"}
          bodyApi={{ columnSort: "loan_tks_totalloan" }}
          color={["#F9757E", "#FDCFD2"]}
          ChartComponent={MultiLineChart}
        />
      </div>
    </div>
  );
}

export default Accounting;
