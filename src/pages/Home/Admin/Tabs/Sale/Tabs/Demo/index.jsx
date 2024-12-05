import MultiLineChart from "src/components/Widgets/Chart/WGMultiLineChart";
import DualColumnChart from "src/components/Widgets/Chart/WGDualColumnChart";
import ColumnLineChart from "src/components/Widgets/Chart/WGColumnLineChart";
import PieDonutChart from "src/components/Widgets/Chart/WGPieDonutChart";
import RoseChart from "src/components/Widgets/Chart/WGRoseChart";
import AreaChart from "src/components/Widgets/Chart/WGAreaChart";
import RankListHorizal from "src/components/Widgets/Chart/WGRankListHorizal";
import RankListVectical from "src/components/Widgets/Chart/WGRankListVectical";
import InfoBoard from "src/components/Widgets/Chart/WGInfoBoard";
import TagBage from "src/components/Widgets/Chart/WGTagBage";
import OneBarChart from "src/components/Widgets/Chart/WGOneBarChart";
import ProcessChart from "src/components/Widgets/Chart/WGProcessChart";
import ServerUrl from "../../../../../../../constants/ServerUrl";
import "./style.scss";

const data = [
  [
    { xField: "Tuần 1", value: 110, time: "Tháng này" },
    { xField: "Tuần 2", value: 50, time: "Tháng này" },
    { xField: "Tuần 3", value: 20, time: "Tháng này" },
    { xField: "Tuần 4", value: 100, time: "Tháng này" },
  ],
  [
    { xField: "Tuần 1", value: 20, time: "Cùng kỳ" },
    { xField: "Tuần 2", value: 300, time: "Cùng kỳ" },
    { xField: "Tuần 3", value: 120, time: "Cùng kỳ" },
    { xField: "Tuần 4", value: 200, time: "Cùng kỳ" },
  ],
];

const newdata = [
  [
    { xField: "Khách hàng mới", value: 86 },
    { xField: "Liên hệ mới", value: 36 },
    { xField: "Chưa xử lý", value: 26 },
  ],
  [
    { xField: "Khách hàng mới", value: 80 },
    { xField: "Liên hệ mới", value: 140 },
    { xField: "Chưa xử lý", value: 35 },
  ],
];

const dataProduct = [
  [
    { xField: "Máy", value: 80 },
    { xField: "Ngũ kim", value: 210 },
    { xField: "Linh kiện", value: 104 },
    { xField: "Vật tư SX", value: 80 },
  ],
  [
    { xField: "Máy", value: 85 },
    { xField: "Ngũ kim", value: 190 },
    { xField: "Linh kiện", value: 125 },
    { xField: "Vật tư SX", value: 80 },
  ],
];

const dataAccount = [
  [
    { xField: "Sinh đơn hàng", value: 210 },
    { xField: "Mua lần đầu", value: 50 },
    { xField: "Mua lại", value: 100 },
    { xField: "Công nợ", value: 30 },
  ],
  [
    { xField: "Sinh đơn hàng", value: 220 },
    { xField: "Mua lần đầu", value: 70 },
    { xField: "Mua lại", value: 99 },
    { xField: "Công nợ", value: 30 },
  ],
];

const dataOneBar = [
  [
    {
      xField: "09-08-2023 11:22:56",
      value: 8451129085,
      time: "Quá hạn",
      count: 62,
    },
    {
      xField: "09-08-2023 11:22:56",
      value: 5623667800,
      time: "Trong hạn",
      count: 62,
    },
  ],
  [],
];

const boardInfo = [
  {
    title: "7 sản phẩm",
    subTitle: "Sắp hết hàng",
    iconSrc: ServerUrl.urlSub + "assets/icon/Products.svg",
    styleIcon: { width: "22px" },
  },
  {
    title: "5 đặt hàng",
    subTitle: "Đang chờ nhập",
    iconSrc: ServerUrl.urlSub + "assets/icon/In.svg",
    styleIcon: { height: "22px" },
  },
  {
    title: "2 xin duyệt",
    subTitle: "Yêu cầu mua hàng",
    iconSrc: ServerUrl.urlSub + "assets/icon/PurchaseOrder.svg",
    styleIcon: { width: "22px" },
  },
  {
    title: "3 hợp đồng",
    subTitle: "Đang chờ xuất kho",
    iconSrc: ServerUrl.urlSub + "assets/icon/Ra.svg",
    styleIcon: { height: "22px" },
  },
];

const dataDemo = [
  [
    {
      title: "Công Ty Thăng Long Hà Nội",
      subTitle: "Minh Cảnh",
      value: ["1,200 cái"],
      subValue: ["12", "40"],
      imgUrl: "storage/2023/February/week2/150625_HÌNH_HỒNG_XANH.jpg",
      status: "Cá nhân",
      statusType: "success",
    },
    {
      title: "Công Ty Thăng Long Hà Nội",
      subTitle: "Minh Cảnh",
      value: [1],
      subValue: ["12", "40"],
      imgUrl: "storage/2023/February/week2/150625_HÌNH_HỒNG_XANH.jpg",
      status: "Cá nhân",
      statusType: "danger",
    },
    {
      title: "Công Ty Thăng Long Hà Nội",
      subTitle: "Minh Cảnh",
      value: [1, 10],
      subValue: ["12"],
      imgUrl: "storage/2023/February/week2/150625_HÌNH_HỒNG_XANH.jpg",
      status: "Cá nhân",
      statusType: "error",
    },
    {
      title: "Công Ty Thăng Long Hà Nội",
      subTitle: "Minh Cảnh",
      status: "Cá nhân",
      statusType: "info",
    },
  ],
  [],
];

function Demo() {
  console.log("re-render account");
  return (
    <div className="Demo-container">
      <div className="grid-quotes">
        <OneBarChart
          data={dataOneBar}
          title={"OneBarChart"}
          bageLabel={"khách hàng"}
          color={["#F9757E", "#A0AEC0"]}
          showLegend={true}
        />
      </div>
      <InfoBoard title={"InfoBoard"} data={boardInfo} showTimeNow={true} />
      <div className="group-tab-bage">
        <TagBage title={"TagBage"} value={4} iconSrc={ServerUrl.urlSub + "assets/icon/Products.svg"} />
        <TagBage title={"TagBage"} value={4} iconSrc={ServerUrl.urlSub + "assets/icon/Products.svg"} />
        <TagBage title={"TagBage"} value={4} iconSrc={ServerUrl.urlSub + "assets/icon/Products.svg"} />
        <TagBage title={"TagBage"} value={4} iconSrc={ServerUrl.urlSub + "assets/icon/Products.svg"} />
      </div>

      <RankListVectical
        data={dataDemo}
        title={"RankListVectical"}
        showTotal={true}
        showCount={true}
        colorCountRow={true}
        subTitleIcon=""
        colorFirstValue="red"
        colorFirstSubValue="#64748B"
        countLabel="còn nợ"
        tooltipValue=""
        tooltipSubValue=""
        onFullScreen={() => console.log("Full")}
      />
      {/* <RankListHorizal
        title={"RankListHorizal"}
        sortBy={"success"}
        data={dataTopQuotes}
        showUnit={false}
        showCup={false}
        showStar={false}
        onFullScreen={() => console.log("Full")}
        isLoading={false}
      /> */}

      <MultiLineChart
        data={data}
        title={"MultiLineChart"}
        color={["#04B9A7", "#A7E6E0"]}
        total={480}
        diff={"-10%"}
        diffTyle={"error"}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <AreaChart
        data={data}
        title={"AreaChart"}
        color={["#04B9A7", "#A7E6E0"]}
        total={480}
        diff={"-10%"}
        diffTyle={"error"}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <ColumnLineChart
        title={"ColumnLineChart"}
        color={["#04B9A7", "#A7E6E0"]}
        data={data}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <DualColumnChart
        title={"DualColumnChart"}
        isGroup={true}
        color={["#04B9A7", "#A7E6E0"]}
        data={data}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <PieDonutChart
        title={"PieDonutChart"}
        color={["#2275FF", "#899ABA", "#F9757E"]}
        showTotalCenter={true}
        positionLegend={"right"}
        colorTotalCenter={"#229AFE"}
        data={newdata}
        showDiffItem={false}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <PieDonutChart
        title={"PieDonutChart"}
        color={["#2275FF", "#899ABA", "#F9757E", "#04B9A7"]}
        positionLegend={"left"}
        data={dataProduct}
        showDiffItem={true}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <RoseChart
        title={"RoseChart"}
        color={["#2275FF", "#899ABA", "#F9757E"]}
        showTotalCenter={true}
        positionLegend={"right"}
        colorTotalCenter={"#04B9A7"}
        data={newdata}
        showDiffItem={true}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <RoseChart
        title={"RoseChart"}
        color={["#899ABA", "#E2E8F0", "#FDE1AE", "#F9757E"]}
        showTotalCenter={false}
        positionLegend={"right"}
        colorTotalCenter={"#04B9A7"}
        data={dataAccount}
        showDiffItem={true}
        onFullScreen={() => console.log("full")}
        isLoading={false}
      />

      <ProcessChart title={"ProcessChart"} data={dataProduct} />
    </div>
  );
}

export default Demo;
