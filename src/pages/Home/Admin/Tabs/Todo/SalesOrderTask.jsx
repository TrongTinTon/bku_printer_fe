import { WGBoxList, WGBoxItem } from "src/components/Widgets";
import ServerUrl from "src/constants/ServerUrl";
import { data as fakeData } from "src/constants/fakeData";

function SalesOrderTask() {
  const renderItem = (listData, colorStyle, icon) => {
    return listData.map((item, index) => {
      return (
        <WGBoxItem
          key={index}
          avatarUrl={item["assigned_user_id"].image}
          label={item.subject}
          status={item.status}
          subLabel={item["account_id"]?.label}
          colorStyle={colorStyle}
          icon={icon}
          createTime={"1m trước"}
          onPressInfo={() => {}}
        />
      );
    });
  };
  return (
    <WGBoxList
      title="Duyệt hợp đồng"
      icon={ServerUrl.urlSub + "assets/icon/SalesOrder.svg"}
      iconBG={ServerUrl.urlSub + "assets/icon/SalesOrder-Blur.svg"}
      colorStyle="danger"
      listData={fakeData["SalesOrder"]}
      renderItem={renderItem}
    />
  );
}
export default SalesOrderTask;
