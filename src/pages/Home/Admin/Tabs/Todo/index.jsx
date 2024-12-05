import React, { useState, useEffect, memo } from "react";
import { WGBoxList, WGSlider, WGCheckBoxList, WGPostList, WGBoxItem, WGCalendar } from "src/components/Widgets";
import ServerUrl from "src/constants/ServerUrl";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import QuotesTask from "./QuotesTask";
import SalesOrderTask from "./SalesOrderTask";
import PurchaseOrderTask from "./PurchaseOrderTask";
import "./style.scss";

function Todo() {
  console.log("re-render todo");

  const renderItemAbsence = (listData, colorStyle, icon) => {
    return listData.map((item, index) => {
      return (
        <WGBoxItem
          key={index}
          avatarUrl={item["assigned_user_id"].image}
          label={item.subject}
          status={item.status}
          subLabel={item["account_id"]?.label}
          colorStyle={colorStyle}
          createTime={"1m trước"}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );
    });
  };

  return (
    <div className="todo-container">
      <div className="crm-row">
        <div className="crm-col grid-quotes">
          <QuotesTask />
        </div>
        <div className="crm-col grid-salesOrder">
          <SalesOrderTask />
        </div>
        <div className="crm-col grid-purchaseOrder">
          <PurchaseOrderTask />
        </div>

        {/* <div className="crm-col grid-payOrder">
          <WGSlider
            title="Đề nghị thanh toán"
            icon={ServerUrl.urlSub + "assets/icon/ThanhToan.svg"}
            listData={fakeData["PayOrder"]}
          />
        </div> */}

        {/* <div className="crm-col grid-absence">
          <WGBoxList
            title="Đơn xin nghỉ phép"
            icon={ServerUrl.urlSub + "assets/icon/Absence.svg"}
            colorStyle="success"
            listData={fakeData["Absence"]}
            renderItem={renderItemAbsence}
          />
        </div>
        <div className="crm-col grid-event">
          <WGCalendar title="Sự kiện" icon={ServerUrl.urlSub + "assets/icon/Task.svg"} listData={fakeData["Event"]} />
        </div>

        <div className="crm-col grid-post">
          <WGPostList
            title="Bài đăng mới"
            icon={ServerUrl.urlSub + "assets/icon/Absence.svg"}
            colorStyle="success"
            listData={fakeData["Post"]}
          />
        </div>

        <div className="crm-col grid-productOrder">
          <WGCheckBoxList
            title="Sản phẩm cần đặt hàng"
            icon={ServerUrl.urlSub + "assets/icon/Products.svg"}
            colorStyle="info"
            listData={fakeData["ProductOrder"]}
          />
        </div> */}
      </div>
    </div>
  );
}

export default memo(Todo);
