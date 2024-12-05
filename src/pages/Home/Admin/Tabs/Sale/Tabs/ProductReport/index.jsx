import { getProductTopSale, getProductSold } from "src/store/module/dashboardAction";
import RankListVectical from "src/components/Widgets/Chart/WGRankListVectical";
import MultiLineChart from "src/components/Widgets/Chart/WGMultiLineChart";
import RootChart from "src/pages/Home/Feature/RootChart";
import "./style.scss";

function ProductReport() {
  console.log("render-ProductReport");
  return (
    <div className="productReport-container">
      <div className="grid-productSold">
        <RootChart
          title={"Sản phẩm đã bán"}
          action={getProductSold}
          color={["#2275FF", "#B2CFFF"]}
          selectOption={[
            { value: "Máy", label: "Máy" },
            { value: "Ngũ kim", label: "Ngũ kim" },
            { value: "Linh kiện", label: "Linh kiện" },
            { value: "Tất cả", label: "Tất cả" },
          ]}
          ChartComponent={MultiLineChart}
        />
      </div>
      <div className="grid-productQty">
        <RootChart
          title={"Sản phẩm bán chạy"}
          bodyApi={{ columnSort: "quantity" }}
          action={getProductTopSale}
          colorFirstSubValue="#64748B"
          selectOption={[
            { value: "Máy", label: "Máy" },
            { value: "Ngũ kim", label: "Ngũ kim" },
            { value: "Linh kiện", label: "Linh kiện" },
            { value: "Tất cả", label: "Tất cả" },
          ]}
          ChartComponent={RankListVectical}
        />
      </div>
      <div className="grid-productTotal">
        <RootChart
          title={"Sản phẩm doanh số cao"}
          action={getProductTopSale}
          colorFirstValue="#33BA35"
          colorFirstSubValue="#04B9A7"
          tooltipSubValue="% / tổng"
          selectOption={[
            { value: "Máy", label: "Máy" },
            { value: "Ngũ kim", label: "Ngũ kim" },
            { value: "Linh kiện", label: "Linh kiện" },
            { value: "Tất cả", label: "Tất cả" },
          ]}
          ChartComponent={RankListVectical}
        />
      </div>
    </div>
  );
}

export default ProductReport;
