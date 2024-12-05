import { WGBoxList, WGBoxItem } from "src/components/Widgets";
import ServerUrl from "src/constants/ServerUrl";
import { data as fakeData } from "src/constants/fakeData";

function QuotesTask() {
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
      title="Đang xin giá"
      icon={ServerUrl.urlSub + "assets/icon/Quotes.svg"}
      iconBG={ServerUrl.urlSub + "assets/icon/Quotes-Blur.svg"}
      colorStyle="success2"
      listData={fakeData["Quotes"]}
      renderItem={renderItem}
    />
  );
}
export default QuotesTask;
