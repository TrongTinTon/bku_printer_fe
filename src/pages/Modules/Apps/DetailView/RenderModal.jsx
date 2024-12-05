/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Tabs, Tooltip, Skeleton, App as AntdApp, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TabInfo from "./Tabs/Info/Index";
import TabHistory from "./Tabs/History/index";
import { getRecord, getCountRelatedRecord, saveRecord } from "src/store/module/actions";
import appGlobal from "src/global/AppGlobal";
import ServerUrl from "src/constants/ServerUrl";

function RenderModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modal, message, notification } = AntdApp.useApp();
  const { module, recordId, onCloseModal, tabsList, placementTab } = props;

  const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
  const defaultActiveTab = configDetailView?.[module?.name]?.activeTab || "0";
  const moduleLists = useSelector((state) => state.module.moduleLists);
  const moduleInfo = moduleLists?.find((item) => item?.name === module?.name);
  const userInfo = appGlobal.GetUserInfo();

  const recordData = useRef({});
  const countRelatedModules = useRef([]);
  const tabLabelRef = useRef([]);
  const headerLeftRef = useRef(null);
  const headerRightRef = useRef(null);
  const isRecordChanged = useRef(false);
  const isEditing = useRef(false);

  const newRelatedModules = moduleInfo?.relatedModules?.map((item) => {
    return {
      label: item?.label,
      icon: "",
      module: item?.module,
      content: () => {
        return <>{item?.label}</>;
      },
    };
  });

  useEffect(() => {
    if (recordId) {
      isRecordChanged.current = false;
      isEditing.current = false;
      defaultActiveTab !== "0" && fetchDataRecord(recordId);
      fetchCountRelatedModules();
    } else {
      onCloseModal();
    }
  }, [recordId]);

  // Fetch data
  const fetchDataRecord = async (record) => {
    const result = await dispatch(getRecord({ module: module.name, record: record }));
    if (result) {
      console.log(result);
      recordData.current = result;
      headerLeftRef.current?.setData(result);
      headerRightRef.current?.setData(result);
    } else {
      modal.confirm({
        className: "arlert-no-permission",
        title: "Không có quyền truy cập!",
        content: "Bạn không có quyền truy cập vào nội dung này!",
        okText: "Trang chủ",
        cancelText: "Quay lại",
        autoFocusButton: null,
        onCancel: () => {
          onCloseModal();
        },

        onOk: () => {
          navigate("/");
        },
      });
    }
    return result;
  };

  // Fetch count related modules
  const fetchCountRelatedModules = async () => {
    const result = await dispatch(getCountRelatedRecord({ module: module.name, recordID: recordId }));

    if (result && result.success) {
      countRelatedModules.current = result;
      tabLabelRef.current?.forEach((item) => {
        const count = result?.find((countItem) => countItem?.relatedModule === item?.module)?.count;
        item?.setData({ count: count });
      });
    }
  };

  // Save data
  const saveDataRecord = async (values) => {
    console.log(values);
    const isAjax = values?.LineItems?.length > 0 ? false : true;
    const result = await dispatch(
      saveRecord({ module: module.name, record: recordId, isAjax: isAjax, values: values })
    );
    if (result?.record) {
      recordData.current = result;
      isRecordChanged.current = true;
      message.success("Cập nhật thành công", [2]);
      return result?.record;
    } else {
      message.error("Cập nhật thất bại", [2]);
      return false;
    }
  };

  const tabsItems = [
    {
      label: "Thông tin",
      icon: "fa-regular fa-circle-question",
      content: TabInfo,
      props: { fetchDataRecord: fetchDataRecord, saveDataRecord: saveDataRecord, isEditing: isEditing },
    },
    { label: "Lịch sử", icon: "fa-clock-rotate-left", content: TabHistory },
    ...(!tabsList ? newRelatedModules : tabsList),
  ];

  const noticationBack = () => {
    const config = (
      <div>
        <Button type="link" onClick={() => notification.destroy()}>
          Ở lại
        </Button>
        <Button
          type="primary"
          onClick={() => {
            notification.destroy();
            isEditing.current = false;
            onClosed();
          }}>
          Đóng
        </Button>
      </div>
    );

    notification.warning({
      key: "warning-save",
      message: "Cảnh báo chưa lưu!",
      description: "Thay đổi chưa lưu. Bạn có muốn đóng không?",
      btn: config,
      duration: 0,
      placement: "top",
      closeIcon: <FaIcon icon="fa-xmark" />,
      className: "notification-custom mask",
    });
  };

  const getCountRelatedTab = (module) => {
    const count = countRelatedModules.current?.find((item) => item?.relatedModule === module)?.count;
    return count;
  };

  const onChangeTab = (key) => {
    const config = { activeTab: key };
    appGlobal.onSaveConfigDetailView(module?.name, config);
    isEditing.current = false;
  };

  // Handle close modal
  const onClosed = () => {
    if (isEditing.current) {
      noticationBack();
      return;
    }
    isRecordChanged.current && onReloadListCurrent();
    onCloseModal();
  };

  const onReloadListCurrent = () => {
    const btnReloadList = document.getElementById("btnReloadListTable");
    if (btnReloadList) btnReloadList.click();
  };

  const getDataRecord = () => {
    return recordData?.current;
  };

  const renderTabBar = (propsTab, DefaultTabBar) => {
    return (
      <div className={`detail-tab-panel ${placementTab}`}>
        <DefaultTabBar {...propsTab} />
      </div>
    );
  };

  const tabs = tabsItems?.map((item, index) => {
    const Content = item?.content;
    const itemProps = {
      ...item?.props,
      moduleLists: moduleLists,
      module: module,
      moduleInfo: moduleInfo,
      recordId: recordId,
      getDataRecord: getDataRecord,
      userInfo: userInfo,
    };

    return {
      label: <RenderTabLabel item={item} tabLabelRef={tabLabelRef} getCountRelatedTab={getCountRelatedTab} />,
      key: String(index),
      children: Content ? <Content {...itemProps} /> : <></>,
    };
  });

  const propsHeader = {
    module: module,
    recordId: recordId,
    onCloseModal: onClosed,
  };

  return (
    <div className="modal-container">
      {placementTab !== "in-header" && (
        <div className="modal-header">
          <div className="header-left">{<RenderLeftHeader {...propsHeader} headerLeftRef={headerLeftRef} />}</div>
          <div className="header-right">{<RenderRightHeader {...propsHeader} headerRightRef={headerRightRef} />}</div>
        </div>
      )}
      <div className="modal-body">
        <div className="tabs-container">
          <Tabs
            tabBarExtraContent={
              placementTab === "in-header" && {
                left: <RenderLeftHeader {...propsHeader} headerLeftRef={headerLeftRef} />,
                right: <RenderRightHeader {...propsHeader} headerRightRef={headerRightRef} />,
              }
            }
            renderTabBar={renderTabBar}
            onChange={onChangeTab}
            tabBarGutter={45}
            tabPosition="top"
            animated={false}
            defaultActiveKey={defaultActiveTab}
            destroyInactiveTabPane
            items={tabs}
            moreIcon={
              <div id={`moreIconTab`}>
                <FaIcon icon="fa-ellipsis" />
              </div>
            }
            popupClassName={"tab-more tab-more-detail-app"}
          />
        </div>
      </div>
    </div>
  );
}

const RenderLeftHeader = ({ recordId, module, onCloseModal, headerLeftRef }) => {
  const [data, setData] = useState({});

  const recordData = data?.record || {};
  const recordPermission = data?.permission || {};

  // Field value
  const iconModuleSrc = `${ServerUrl.urlSub}assets/icon/${module?.name}.svg`;
  const labelRecord = recordData?.label?.value || "";
  const stared = recordData?.starred?.value == "1" || false;

  useEffect(() => {
    headerLeftRef.current = {
      setData: setData,
    };
  }, []);

  const onClickStar = useCallback(() => {
    console.log(recordId);
  }, [recordId]);

  // console.log("Left header: ", recordData);

  return (
    <div className="left-extra">
      <div className="group-left">
        <div className="btn-close" onClick={onCloseModal}>
          <FaIcon icon="fa-xmark" />
        </div>
        <img src={iconModuleSrc} alt={module} height={22} width={22} />

        <Tooltip title={labelRecord} zIndex={2500}>
          <div className="title">
            {labelRecord ? labelRecord : <Skeleton.Input active={true} style={{ height: 28, borderRadius: 8 }} />}
          </div>
        </Tooltip>

        <div className={`btn-star ${stared && "active"}`} onClick={onClickStar}>
          {stared ? (
            <img src={`${ServerUrl.urlSub}assets/icon/StarSolid.svg`} alt="star" height={20} />
          ) : (
            <FaIcon className="icon-star" icon="fa-regular fa-star" />
          )}
        </div>
      </div>
    </div>
  );
};

const RenderRightHeader = ({ recordId, module, onCloseModal, headerRightRef }) => {
  const [data, setData] = useState({});

  const recordData = data?.record || {};
  const recordPermission = data?.permission || {};

  useEffect(() => {
    headerRightRef.current = {
      setData: setData,
    };
  }, []);

  const onClickEdit = useCallback(() => {
    // const btnEdit = document.getElementById("btnOpenEditRecord");
    // if (btnEdit) btnEdit.click();
  }, [recordId]);

  return (
    <div className="right-extra">
      <div className="group-right">
        <div className="btn-edit" onClick={onClickEdit}>
          <FaIcon icon="fa-marker" />
        </div>
        <div className="btn-setting">
          <FaIcon icon="fa-gear" />
        </div>
        <div className="btn-more">
          <FaIcon icon="fa-ellipsis" />
        </div>
      </div>
    </div>
  );
};

const RenderTabLabel = ({ item, tabLabelRef, getCountRelatedTab }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    tabLabelRef.current = [...tabLabelRef.current, { module: item?.module, setData: setData }];
  }, []);

  const module = item?.module;
  const iconModuleSrc = `${ServerUrl.urlSub}assets/icon/${module}.svg`;
  const iconModuleActiveSrc = `${ServerUrl.urlSub}assets/icon/${module}-Gray.svg`;

  const count = getCountRelatedTab(module);

  return (
    <div className="tab-label">
      {item?.icon && <FaIcon icon={item?.icon} fontSize={17} />}
      {module && <img className="module-icon" src={iconModuleActiveSrc} alt={module} />}
      {module && <img className="module-icon-active" src={iconModuleSrc} alt={module} />}
      <span>{item?.label}</span>
      {module && count > 0 && <span className={`bage-count bageCountRelatedTab-${module}`}> {count} </span>}
    </div>
  );
};

export default memo(RenderModal);
