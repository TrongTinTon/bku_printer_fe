import { getCountList, getQuotesSuccess, getUserTopModule } from "src/store/module/dashboardAction";
import MultiLineChart from "src/components/Widgets/Chart/WGMultiLineChart";
import ColumnLineChart from "src/components/Widgets/Chart/WGColumnLineChart";
import RankListHorizal from "src/components/Widgets/Chart/WGRankListHorizal";
import RootChart from "src/pages/Home/Feature/RootChart";
import "./style.scss";

function SaleReport() {
  console.log("re-render sale");
  return (
    <div className="saleReport-container">
      <div className="grid-quotes">
        <RootChart
          module="Quotes"
          action={getCountList}
          title="Báo giá"
          color={["#04B9A7", "#A7E6E0"]}
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-quotesSuccess">
        <RootChart
          action={getQuotesSuccess}
          title={"Báo giá thành công"}
          color={["#04B9A7", "#A7E6E0"]}
          ChartComponent={ColumnLineChart}
        />
      </div>

      <div className="grid-SO">
        <RootChart
          module="SalesOrder"
          action={getCountList}
          title="Hợp đồng"
          color={["#F88537", "#FDD4B9"]}
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-topQuotes">
        <RootChart
          action={getUserTopModule}
          module="Quotes"
          title={"Top báo giá"}
          sortBy={"success"}
          showUnit={false}
          showCup={false}
          showStar={false}
          ChartComponent={RankListHorizal}
        />
      </div>

      <div className="grid-sales">
        <RootChart
          module="SalesOrder"
          action={getCountList}
          bodyApi={{ columnSort: "total" }}
          title="Doanh số bán hàng"
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-topSales">
        <RootChart
          action={getUserTopModule}
          bodyApi={{ columnSort: "total" }}
          module="SalesOrder"
          title={"Top doanh số"}
          showUnit={true}
          showCup={true}
          showStar={false}
          ChartComponent={RankListHorizal}
        />
      </div>
    </div>
  );
}

export default SaleReport;
