/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, forwardRef } from "react";
import { useDispatch } from "react-redux";
import { getNotification, saveRecord } from "../../../store/module/actions";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Skeleton, Tooltip } from "antd";
import ServerUrl from "../../../constants/ServerUrl";
import DividerCustom from "../../../components/Divider";
import EmptyList from "../../../components/EmptyList/Index";
import appGlobal from "../../../global/AppGlobal";

const PopupNotification = forwardRef(({ notifications, socket }, ref) => {
  const dispatch = useDispatch();

  const page = useRef(1);
  const listNotificationRef = useRef(null);
  const scrollPosition = useRef(0);

  const [listData, setListData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const totalPage = notifications.totalPage;
  const totalCount = notifications.totalCount;
  const dataFromSocket = notifications.fromSocket;

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (dataFromSocket) {
      const { type, status, record } = dataFromSocket;
      if (type === "create" && status === "Open") {
        if (scrollPosition.current > 150) {
          !showMessage && setShowMessage(true);
        }
        setListData(() => {
          const checkDup = listData.find((item) => item.id === record.id);
          return !checkDup ? [record, ...listData] : listData;
        });
      }
      if ((type === "update" && status === "Closed") || type === "delete") {
        setListData(() => {
          return listData.filter((item) => item.id !== record.id);
        });
      }
    }
  }, [dataFromSocket]);

  const fetchData = async (lastid) => {
    const datas = !isLoading && (await dispatch(getNotification({ lastid: lastid || "" })));

    if (datas) {
      setLoading(false);
      if (page.current === 1) {
        setListData(datas.records);
      } else {
        setListData((prevData) => {
          const newData = [...prevData, ...datas.records];
          const uniqueData = Array.from(new Set(newData.map((item) => item.id)))
            .map((id) => newData.find((item) => item.id === id))
            .sort((a, b) => b.id.split("x")[1] - a.id.split("x")[1]);
          return uniqueData;
        });
      }
    }
  };

  const onPressClose = async (itemId) => {
    if (!isLoading) {
      setListData(() => {
        return listData.filter((item) => item.id !== itemId);
      });
      const recordId = itemId.split("x")[1];
      const body = {
        module: "ITS4YouQuickReminder",
        record: recordId,
        values: {
          reminderstatus: "Closed",
        },
      };
      await dispatch(saveRecord(body));
      getDataWhenScrollBottom();
    }
  };

  const onPressBackground = () => {
    document.querySelector("#btnNotification").click();
  };

  const handleRemoveAll = async () => {
    // newSocket && newSocket.emit("message", "demo");
  };

  const scrollTop = () => {
    listNotificationRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setShowMessage(false);
  };

  const getDataWhenScrollBottom = () => {
    if (listNotificationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listNotificationRef.current;
      const isBottom = scrollHeight - 50 <= scrollTop + clientHeight;

      scrollPosition.current = scrollTop;
      if (showMessage && scrollTop <= 150) {
        setShowMessage(false);
      }

      if (isBottom && !isLoading) {
        if (page.current < totalPage) {
          page.current = page.current + 1;
          setLoading(true);
          const lastItem = listData[listData.length - 1];
          fetchData(lastItem?.crmid * 1);
        }
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const imgSrc = item.parent_id?.module || "NoModule";
    const relatedLabel = item.parent_id?.label || "--";
    const serverTime = appGlobal.convertToServerTime(item.createdtime);
    const timeAgo = appGlobal.timeAgo(serverTime);

    return (
      <div key={index} className="item-notification">
        <div className="item-notification_img">
          <img src={ServerUrl.urlSub + `assets/icon/${imgSrc}.svg`} width="30px" height="30px" />
        </div>
        <div className="item-notification_group-info">
          <h4>{item.label}</h4>
          <div className="relation">{relatedLabel}</div>
          <div className="timecreate">
            <FaIcon icon="fa-regular fa-clock" />
            <span>{timeAgo}</span>
          </div>
        </div>
        <Tooltip title="Đóng">
          <div className="item-notification_btn-close-item" onClick={() => onPressClose(item.id)}>
            <FaIcon icon="fa-xmark" />
          </div>
        </Tooltip>
      </div>
    );
  };

  const renderItemSkeleton = () => {
    return (
      <div style={{ display: "flex", marginBottom: 15 }}>
        <Skeleton.Avatar active shape="circle" size={50} />
        <div className="item-notification_group-info">
          <Skeleton.Input active block />
          <Skeleton.Input active size="small" style={{ margin: "8px 0", width: 250 }} />
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>
        <Skeleton.Avatar active shape="circle" size={35} />
      </div>
    );
  };

  const renderList = () => {
    const listSkeleton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return listData.length > 0 ? (
      listData.map((item, index) => {
        return renderItem({ item, index });
      })
    ) : isLoading && totalCount > 0 ? (
      listSkeleton.map((item, index) => {
        return index < totalCount ? <div key={index}>{renderItemSkeleton()}</div> : null;
      })
    ) : (
      <EmptyList module={"Thông báo"} />
    );
  };

  return (
    <>
      <div className="dropdown-content">
        <div ref={listNotificationRef} onScroll={getDataWhenScrollBottom} className="container">
          <div className={`container_message ${showMessage && "container_message--show"}`} onClick={scrollTop}>
            <span>
              <FaIcon icon="fa-angles-up" style={{ paddingRight: 5 }} />
              Thông báo mới
            </span>
          </div>
          <div className="container_header">
            <h2>Thông báo</h2>

            <div className="btn-close-all" onClick={handleRemoveAll}>
              <FaIcon icon="fa-check-double" />
              <span>Đóng tất cả</span>
            </div>
          </div>
          <DividerCustom />

          <div className="container_list-notification">
            {renderList()}
            {listData.length !== totalCount && listData.length > 10 && renderItemSkeleton()}
          </div>
        </div>
        <div className="mask-overlay" onClick={onPressBackground}></div>
      </div>
    </>
  );
});

export default PopupNotification;
