import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button, Timeline, Skeleton, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getHistory } from "src/store/module/actions";
import appGlobal from "src/global/AppGlobal";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import ServerUrl from "src/constants/ServerUrl";
import NoPermission from "src/components/NoPermission";
import moment from "moment/min/moment-with-locales";
import RenderFieldWithType from "./RenderFieldWithType";
import EmptyList from "src/components/EmptyList";
import "./style.scss";

const statusMapping = {
  updated: "đã cập nhật",
  restored: "đã khôi phục",
  deleted: "đã xóa",
  link: "liên kết",
  unlink: "đã hủy liên kết",
  created: "đã tạo",
};

function TabHistory(props) {
  const { module, recordId, getDataRecord } = props;
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(true);

  const listData = useRef([]);
  const currentPage = useRef(1);
  const nextPage = useRef(null);
  const totalPage = useRef(1);
  const isFirstLoad = useRef(true);
  const isShowBtnNextPage = totalPage.current === currentPage.current;
  const recordData = getDataRecord()?.record || {};
  const notPermission = recordData?.notpermission || false;

  console.log("render tab history");

  useEffect(() => {
    fetchData();
  }, [module, recordId]);

  const fetchData = useCallback(async (page = currentPage.current) => {
    const body = {
      module: module.name,
      records: recordId,
      page: page,
      limit: 100,
    };
    const data = await dispatch(getHistory(body));

    if (page === 1) {
      listData.current = data.records;
      totalPage.current = data.totalPage;
      isFirstLoad.current = false;
    } else {
      if (nextPage.current === data.nextPage) return;
      listData.current = [...listData.current, ...data.records];
    }

    nextPage.current = data.nextPage;
    setLoading(false);
  }, []);

  // action
  const handleNextPage = () => {
    currentPage.current = currentPage.current + 1;
    setLoading(true);
    fetchData();
  };

  // render
  const renderItems = (list) =>
    list?.map(function (record, index) {
      const status = record.statuslabel;
      const valueNonCheck = ["link", "unlink"];
      const isLinkNull = valueNonCheck.some((item) => status === item) && !record.values;
      return (
        !isLinkNull && {
          key: index,
          className: "timeline-history-item",
          dot: <TimelineDot record={record} />,
          children: <TimelineContent record={record} />,
        }
      );
    });

  const renderSkeletonItem = (key) => {
    return (
      <div key={key} className="timeline-history">
        <div className="history-skeleton-item">
          <Skeleton.Avatar active={true} size={"default"} shape={"circle"} />

          <div className="ske-item-content">
            <Skeleton.Input active={true} size={"default"} style={{ width: 370 }} />
            <div className="ske-item-value">
              <Skeleton.Input active={true} size={"default"} style={{ width: 230, height: 90 }} />
              <Skeleton.Input active={true} size={"default"} style={{ width: 200, height: 80 }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkeletons = () => {
    const countSke = 3;
    const skeletons = [];
    for (let i = 0; i < countSke; i++) {
      skeletons.push(renderSkeletonItem(i));
    }
    return skeletons;
  };

  return (
    <div className="timeline-history-container">
      {notPermission ? (
        <NoPermission />
      ) : (
        <>
          {isLoading && isFirstLoad.current && renderSkeletons()}
          {!isFirstLoad.current && listData.current?.length > 0 && (
            <Timeline className="timeline-history" items={renderItems(listData.current)} />
          )}

          {!isLoading && listData.current?.length === 0 && <EmptyList width={170} module={`cập nhật gần đây`} />}

          {totalPage.current > 1 && !isShowBtnNextPage && (
            <div className="timeline-history-footer">
              <Button className="load-more" onClick={handleNextPage} disabled={isLoading}>
                <FaIcon icon="fa-angles-down" />
                <span>Xem thêm</span>
                <Spin
                  spinning={isLoading}
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 16,
                      }}
                      spin
                    />
                  }
                />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const ContentContainer = ({ children }) => {
  return <div className="timeline-item_container">{children}</div>;
};

const TimelineDot = ({ record }) => {
  switch (record.statuslabel) {
    case "link":
    case "unlink":
      const moduleLink = record.values?.[0]?.module || "NoModule";
      const imgSrcLink = moduleLink ? `${ServerUrl.urlSub}assets/icon/${moduleLink}.svg` : "";
      return (
        <div className="update_icon">
          <img className="update_image_module" src={imgSrcLink} />
        </div>
      );
    default:
      const userInfo = record?.modifieduser;
      const imgSrcUser = userInfo?.imgUrl
        ? `${ServerUrl.value}/${userInfo?.imgUrl}`
        : `${ServerUrl.value}/layouts/v7/skins/images/defautAvatar.png`;
      return (
        <div className="update_icon">
          <img className="update_image_user" src={imgSrcUser} />
        </div>
      );
  }
};

const TimelineContent = ({ record }) => {
  return (
    <ContentContainer>
      <TimelineHeader
        label={record.modifieduser.label}
        status={record.statuslabel}
        modifiedtime={record.modifiedtime}
        record={record}
      />
      <TimelineBody record={record} />
    </ContentContainer>
  );
};

const TimelineHeader = ({ record }) => {
  const status = record.statuslabel;
  const label = status == "link" ? record.values?.[0].moduleName : record.modifieduser.label;
  const modifiedtime = record.modifiedtime;
  const time = moment(modifiedtime).locale("vi");
  const formattedDateTime = time.format("dddd, DD-MM-YYYY, [lúc] HH:mm:ss");

  return (
    <div className="header-timeline-item">
      <div className="title-item">
        <span className="owner-title">{label}</span>
        <span>{` ${statusMapping[status]}`}</span>
      </div>
      <div className="modifiedtime">
        <span className="time-text">{`${appGlobal.timeAgo(modifiedtime)}`}</span>
        <span>|</span>
        <span className="time-full">{`${formattedDateTime}`}</span>
      </div>
    </div>
  );
};

const TimelineBody = ({ record }) => {
  if (record.statuslabel == "updated") {
    return (
      <div className="body-timeline-item">
        {record.values.map(function (item, i) {
          return item.fieldType && <RenderFieldWithType key={`${record.key}_${i}`} item={item} />;
        })}
      </div>
    );
  } else if (record.statuslabel == "link") {
    return <div className="body-timeline-item">{record.values?.[0].label}</div>;
  }
};

export default TabHistory;
