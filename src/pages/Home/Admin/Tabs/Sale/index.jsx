import { memo } from "react";
import { Tabs } from "antd";
import AccountReport from "./Tabs/AccountReport";
import SaleReport from "./Tabs/SaleReport";
import ProductReport from "./Tabs/ProductReport";
import Demo from "./Tabs/Demo";

function Sale() {
  const items = [
    {
      key: "1",
      label: `Tình hình kinh doanh`,
      children: <SaleReport />,
    },
    {
      key: "2",
      label: `Phân tích khách hàng`,
      children: <AccountReport />,
    },
    {
      key: "3",
      label: `Phân tích sản phẩm`,
      children: <ProductReport />,
    },
    {
      key: "4",
      label: `Demo`,
      children: <Demo />,
    },
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
