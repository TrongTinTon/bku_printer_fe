import { WGBoxList, WGBoxItem } from "src/components/Widgets";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import ServerUrl from "src/constants/ServerUrl";
import { data as fakeData } from "src/constants/fakeData";

function PurchaseOrderTask() {
  const renderItem = (listData, colorStyle, icon) => {
    return listData.map((item, index) => {
      return (
        <WGBoxItem
          key={index}
          avatarUrl={item["assigned_user_id"].image}
          label={item.subject}
          status={item.status}
          subLabel={item["account_id"]?.label}
          iconSubLabel={<FaIcon icon="fa-ship" />}
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
      title="Duyệt đặt hàng"
      icon={ServerUrl.urlSub + "assets/icon/PurchaseOrder.svg"}
      iconBG={ServerUrl.urlSub + "assets/icon/PurchaseOrder-Blur.svg"}
      colorStyle="lavender"
      listData={fakeData["PurchaseOrder"]}
      renderItem={renderItem}
    />
  );
}
export default PurchaseOrderTask;
