/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getInvoiceBalance } from "src/store/module/dashboardAction";
import { Tooltip, Spin, Dropdown, Checkbox } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "../../../../../../global/AppGlobal";
import DividerCustom from "../../../../../../components/Divider";
import CheckboxCustom from "../../../../../../components/Checkbox";
import NoResult from "../../../../../../components/NoResult";
import "./style.scss";

function DetailInvoiceBalance(props) {
  const { totalNow, totalFirst, totalSecond, data } = props;
  const dispatch = useDispatch();

  const isFirstLoading = useRef(false);
  const totalCount = useRef(0);

  const percentFirst = (totalFirst / totalNow) * 100;
  const percentSecond = (totalSecond / totalNow) * 100;
  const timeLoad = data?.[0]?.[0]?.xField;

  const checkboxData = ["Chưa đến hạn", "Quá hạn", "Chưa có ngày"];

  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState(checkboxData);
  const [isLoading, setLoading] = useState(false);

  // Get data from api //
  const fetchData = useCallback(async () => {
    setLoading(true);
    const body = {
      mode: "detail",
    };

    const data = await dispatch(getInvoiceBalance(body));

    if (data) {
      setListData(data?.now);
      setLoading(false);
      isFirstLoading.current = false;
      totalCount.current = data?.now.length;
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onPressChildItem = (crmid) => {
    window.open(
      `https://quocduygroup.com/vtiger/index.php?module=Invoice&view=Detail&record=${crmid}&app=SALES`,
      "_blank"
    );
  };

  const onChangeFilter = (checkedValues) => {
    setFilter(checkedValues);
  };

  const renderList = () => {
    // Sort data by filter option //
    const filteredList = listData
      .map((item) => {
        const filteredRecords = item.listRecords.filter((childItem) => filter.includes(childItem.status));

        if (filteredRecords.length > 0) {
          return {
            ...item,
            listRecords: filteredRecords,
          };
        }

        return null;
      })
      .filter(Boolean);

    totalCount.current = filteredList.length;

    if (filteredList.length === 0 || isLoading) {
      return <NoResult width={150} style={{ height: "90%" }} />;
    }

    return filteredList.map((item, index) => renderRowItem(item, index));
  };

  const renderRowItemChild = (child, index, childCount) => {
    const isLastChild = index + 1 === childCount;
    const imgUrl = child.owner?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";

    let statusClass = "";
    if (child.status === "Chưa đến hạn") {
      statusClass = "success";
    } else if (child.status === "Quá hạn") {
      statusClass = "error";
    }
    const paymentDay = child.paymentDay ? appGlobal.convertToServerTime(child.paymentDay, "DD-MM-YYYY") : "-- -- --";

    return (
      <div key={`child-${index}`}>
        <div className={`item-child ${isLastChild && "last-child"}`}>
          <Tooltip title={child.subject} placement="top" zIndex={10700}>
            <div className="subject">
              <span onClick={() => onPressChildItem(child.crmid)}>{child.subject}</span>
            </div>
          </Tooltip>
          <div className="owner-img">
            <span>
              <img src={`https://quocduygroup.com/vtiger/${imgUrl}`} />
              {child.owner?.label}
            </span>
          </div>
          <div className="pay-date">Hẹn trả: {paymentDay}</div>
          <div className="status">
            <span className={statusClass}>{child.status}</span>
          </div>
          <div className="balance">₫ {appGlobal.formatCurrency(child.balance, 0)}</div>
        </div>
        {!isLastChild && <DividerCustom className="divider" />}
      </div>
    );
  };

  const renderRowItem = (item, index) => {
    const childList = item.listRecords ? item.listRecords : [];
    const childCount = childList.length;
    const noNum = (index + 1).toString().padStart(2, "0");

    return (
      <div key={index} className="item-balance-container">
        <div className="item-parent">
          <div className="num-no">{noNum}</div>
          <Tooltip title={item.accountname} placement="top" zIndex={10700}>
            <div className="label">{item.accountname}</div>
          </Tooltip>
          <div className="count">{item.listRecords?.length} hóa đơn</div>
          <div className="total">₫ {appGlobal.formatCurrency(item.total, 0)}</div>
          <div className="balance error">₫ {appGlobal.formatCurrency(item.balance, 0)}</div>
        </div>

        {childCount > 0 &&
          childList.map((child, indx) => {
            return renderRowItemChild(child, indx, childCount);
          })}
      </div>
    );
  };

  const renderFilterCheckbox = () => {
    return (
      <div className="balance-filter-contaner">
        <div className="title-filter">Hẹn thanh toán</div>
        <DividerCustom className="divider" />
        <Checkbox.Group defaultValue={filter} onChange={onChangeFilter} className="list-filter">
          {checkboxData.map((item) => (
            <CheckboxCustom key={item} value={item} label={item} />
          ))}
        </Checkbox.Group>
      </div>
    );
  };

  return (
    <div className="invoice-balance">
      <div className="invoice-balance-header">
        <div className="group-value">
          <div className="value">₫ {appGlobal.formatCurrency(totalNow, 0)}</div>
          <div className="title">Tổng công nợ</div>
        </div>

        <div className="group-value">
          <div className="value success">
            ₫ {appGlobal.formatCurrency(totalSecond, 0)}
            <span className="percent success"> ({percentSecond.toFixed(1)}%)</span>
          </div>
          <div className="title">Trong hạn</div>
        </div>

        <div className="group-value">
          <div className={`value error`}>
            ₫ {appGlobal.formatCurrency(totalFirst, 0)}
            <span className={`percent error`}> ({percentFirst.toFixed(1)}%)</span>
          </div>
          <div className="title">Quá hạn</div>
        </div>
      </div>
      <Spin spinning={isLoading} wrapperClassName="loading-spin-balance">
        <div className="invoice-balance-body">
          <div className="table-header">
            <div id="th-filter">
              <Dropdown
                dropdownRender={renderFilterCheckbox}
                trigger={["click"]}
                zIndex={10700}
                destroyPopupOnHide={true}
              >
                <div className="button-filter" onClick={(e) => e.preventDefault()}>
                  <FaIcon fontSize={16} icon={filter.length < 3 ? "fa-filter-circle-xmark" : "fa-filter"} />
                </div>
              </Dropdown>
            </div>
            <div id="th-label">Khách hàng</div>
            <div id="th-count">Số hóa đơn</div>
            <div id="th-total">Tổng hóa đơn</div>
            <div id="th-balance">Tổng công nợ</div>
          </div>
          {renderList()}
        </div>
      </Spin>
      <div className="pagination">
        <div className="group-total">
          <div className="total-count">Tổng: {totalCount.current}</div>
        </div>

        <div className="time-load">Số liệu tính đến: {timeLoad}</div>
      </div>
    </div>
  );
}

export default DetailInvoiceBalance;
