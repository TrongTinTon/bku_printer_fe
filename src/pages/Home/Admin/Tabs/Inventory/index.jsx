import { getCountList, getProductInStock, getProductInOut, getStatusInventory } from "src/store/module/dashboardAction";
import InfoBoard from "src/components/Widgets/Chart/WGInfoBoard";
import MultiLineChart from "src/components/Widgets/Chart/WGMultiLineChart";
import RootChart from "src/pages/Home/Feature/RootChart";
import PieDonutChart from "src/components/Widgets/Chart/WGPieDonutChart";
import ServerUrl from "../../../../../constants/ServerUrl";
import "./style.scss";

function Inventory() {
  console.log("render-Inventory");

  return (
    <div className="inventoryReport-container">
      <div className="grid-status">
        <RootChart
          action={getStatusInventory}
          title={"Tình trạng kho hàng"}
          showTimeNow={true}
          loadOnFirst={true}
          ChartComponent={InfoBoard}
        />
      </div>
      <div className="grid-inStock">
        <RootChart
          module="In"
          action={getCountList}
          color={["#2275FF", "#B2CFFF"]}
          title="Nhập kho"
          ChartComponent={MultiLineChart}
        />
      </div>

      <div className="grid-outStock">
        <RootChart module="Ra" action={getCountList} title="Xuất kho" ChartComponent={MultiLineChart} />
      </div>

      <div className="grid-inventory">
        <RootChart
          title={"Hàng tồn kho"}
          action={getProductInStock}
          color={["#2275FF", "#899ABA", "#F9757E", "#04B9A7"]}
          showTotalCenter={true}
          shortTotalCenter={true}
          positionLegend={"right"}
          colorTotalCenter={"#229AFE"}
          showTimeNow={true}
          loadOnFirst={true}
          ChartComponent={PieDonutChart}
        />
      </div>

      <div className="grid-typeIn">
        <RootChart
          module={"In"}
          title={"Loại hàng nhập"}
          action={getProductInOut}
          color={["#2275FF", "#899ABA", "#F9757E", "#04B9A7"]}
          positionLegend={"right"}
          colorTotalCenter={"#229AFE"}
          showDiffItem={true}
          ChartComponent={PieDonutChart}
        />
      </div>

      <div className="grid-typeOut">
        <RootChart
          module={"Ra"}
          title={"Loại hàng xuất"}
          action={getProductInOut}
          color={["#2275FF", "#899ABA", "#F9757E", "#04B9A7"]}
          positionLegend={"right"}
          colorTotalCenter={"#229AFE"}
          showDiffItem={true}
          ChartComponent={PieDonutChart}
        />
      </div>
    </div>
  );
}

export default Inventory;
