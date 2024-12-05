/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, memo } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setListviewActive } from "src/store/module/reducers";
import RenderTable from "./RenderTable";
import RenderTabs from "./RenderTabs";
import { Button, Tabs, App as AntdApp } from "antd";
import "./style.scss";

function ListView(props) {
  const dispatch = useDispatch();
  const { modal, message } = AntdApp.useApp();

  const { module, recordId, handleSetUrl } = props;
  const moduleLists = useSelector((state) => state.module.moduleLists);
  const moduleListview = moduleLists.find((item) => item.name === module.name)?.listviews;
  const activeKey = useSelector((state) => state.module.listviewActive[module.name]);

  console.log("re-render-listview");

  useEffect(() => {
    if (!moduleListview && module && !recordId) {
      modal.error({
        className: "arlert-no-permission",
        title: "Không có quyền truy cập!",
        content: "Bạn không có quyền truy cập vào nội dung này!",
        okText: "Trang chủ",
        autoFocusButton: null,
        onOk: () => {
          window.location.href = "/erp/";
        },
      });
    }
  }, [moduleLists]);

  const onChangeTab = async (key) => {
    await dispatch(setListviewActive({ moduleName: module.name, data: key }));
    handleSetUrl(key, null, null);
  };

  // On press cell
  const onPressCell = useCallback(
    (props) => {
      const { record, modulePermission } = props;
      const isEditRecord = record?.isEditable;
      const detailAndSelect = modulePermission?.detailAndSelect;
      const detailView = modulePermission?.detailView;

      if ((isEditRecord || detailAndSelect) && detailView) {
        document.querySelector("#btnOpenDetailRecord").click();
      } else {
        handleSetUrl(null, null, null);
        message.error("Bạn không có quyền truy cập vào nội dung này!", 1.5);
      }
    },
    [module]
  );

  const tabs = moduleListview?.map((item, index) => {
    if (item.viewname === "Related list") return null;
    return {
      label: <RenderTabs viewName={item.viewname} module={module} tabKey={item.cvid} />,
      key: item.cvid,
      children: <RenderTable {...props} viewName={item.viewname} tabkey={item.cvid} onPressCell={onPressCell} />,
    };
  });

  const renderTabBar = (propsTab, DefaultTabBar) => {
    return (
      <div className="listview-tab-panel">
        <DefaultTabBar {...propsTab} />
      </div>
    );
  };

  const renderButtonAdd = (
    <Button className="btn-addRecord">
      <FaIcon icon="fa-plus" />
      <span>Tạo mới</span>
    </Button>
  );

  return (
    <div className="listview-container">
      <Tabs
        tabBarExtraContent={renderButtonAdd}
        renderTabBar={renderTabBar}
        activeKey={activeKey}
        onChange={onChangeTab}
        tabBarGutter={50}
        animated={false}
        destroyInactiveTabPane
        items={tabs}
        moreIcon={<FaIcon icon="fa-ellipsis" />}
        popupClassName={"tab-more"}
      />
    </div>
  );
}

export default memo(ListView);
