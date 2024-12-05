/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { getPOBalance } from "src/store/module/dashboardAction";
import { Tooltip, Spin, Dropdown, Checkbox } from "antd";
import { List, AutoSizer } from "react-virtualized";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "../../../../../../global/AppGlobal";
import DividerCustom from "../../../../../../components/Divider";
import CheckboxCustom from "../../../../../../components/Checkbox";
import NoResult from "../../../../../../components/NoResult";
import "./style.scss";

function DetailPOBalance(props) {
  const { totalNow, totalFirst, totalSecond, data } = props;
  const dispatch = useDispatch();

  const isFirstLoading = useRef(false);
  const totalCount = useRef(0);
  const bodyRef = useRef("");

  const percentFirst = (totalFirst / totalNow) * 100;
  const percentSecond = (totalSecond / totalNow) * 100;
  const timeLoad = data?.[0]?.[0]?.xField;

  const checkboxData = ["Trong nước", "Ngoài nước"];

  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState(checkboxData);
  const [isLoading, setLoading] = useState(false);

  // Get data from api //
  const fetchData = useCallback(async () => {
    setLoading(true);
    const body = {
      mode: "detail",
    };

    const data = await dispatch(getPOBalance(body));

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

  // Sort data by filter option //
  const filteredList = listData
    .map((item) => {
      const filteredRecords = item.listRecords.filter((childItem) => filter.includes(childItem.potype));

      if (filteredRecords.length > 0) {
        return {
          ...item,
          size: filteredRecords.length * 70,
          listRecords: filteredRecords,
        };
      }

      return null;
    })
    .filter(Boolean);

  const onChangeFilter = (checkedValues) => {
    setFilter(checkedValues);
  };

  const onPressChildItem = (crmid) => {
    window.open(
      `https://quocduygroup.com/vtiger/index.php?module=PurchaseOrder&view=Detail&record=${crmid}&app=SALES`,
      "_blank"
    );
  };

  const renderList = () => {
    const bodyHeight = bodyRef.current.offsetHeight;
    totalCount.current = filteredList.length;

    if (filteredList.length === 0 || isLoading) {
      return <NoResult width={150} style={{ height: "90%" }} />;
    }

    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            data={filteredList}
            rowCount={filteredList.length}
            overscanRowCount={10}
            width={width - 16}
            height={bodyHeight - 45}
            rowHeight={({ index }) => filteredList[index].size + 90}
            rowRenderer={renderRowItem}
          />
        )}
      </AutoSizer>
    );
  };

  const renderRowItemChild = (child, index, childCount) => {
    const isLastChild = index + 1 === childCount;
    const imgUrl = child.owner?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";

    let typeClass = "";
    if (child.potype === "Trong nước") {
      typeClass = "info";
    } else {
      typeClass = "disable";
    }
    const pocode = child.pocode || "-- -- --";

    return (
      <div key={child.crmid}>
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
          <Tooltip title={"Mã lô hàng"} placement="top" zIndex={10700}>
            <div className="pay-date">#{pocode}</div>
          </Tooltip>
          <div className="status">
            <span className={typeClass}>{child.potype}</span>
          </div>
          <Tooltip title={`~ ₫ ${appGlobal.formatCurrency(child.balance_vnd, 0)}`} placement="top" zIndex={10700}>
            <div className="balance">
              {child.symbol} {appGlobal.formatCurrency(child.balance, 0)}
            </div>
          </Tooltip>
        </div>
        {!isLastChild && <DividerCustom className="divider" />}
      </div>
    );
  };

  const renderRowItem = ({ index, isScrolling, key, style }) => {
    const item = filteredList[index];
    const childList = item.listRecords ? item.listRecords : [];
    const childCount = childList.length;
    const noNum = (index + 1).toString().padStart(2, "0");

    return (
      <div key={key} style={style}>
        <div className="item-balance-container">
          <div className="item-parent">
            <div className="num-no">{noNum}</div>
            <Tooltip title={item.vendorname} placement="top" zIndex={10700}>
              <div className="label">{item.vendorname}</div>
            </Tooltip>
            <div className="count">{item.listRecords?.length} đặt hàng</div>
            <div className="total">₫ {appGlobal.formatCurrency(item.total, 0)}</div>
            <div className="balance error">₫ {appGlobal.formatCurrency(item.balance, 0)}</div>
          </div>

          {childCount > 0 &&
            childList.map((child, indx) => {
              return renderRowItemChild(child, indx, childCount);
            })}
        </div>
        <div style={{ height: 20 }}></div>
      </div>
    );
  };

  const renderFilterCheckbox = () => {
    return (
      <div className="po-balance-filter-contaner">
        <div className="title-filter">Hình thức</div>
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
    <div className="po-balance">
      <div className="po-balance-header">
        <div className="group-value">
          <div className="value">₫ {appGlobal.formatCurrency(totalNow, 0)}</div>
          <div className="title">Tổng nợ mua</div>
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
        <div ref={bodyRef} className="po-balance-body">
          <div className="table-header">
            <div id="th-filter">
              <Dropdown
                dropdownRender={renderFilterCheckbox}
                trigger={["click"]}
                zIndex={10700}
                destroyPopupOnHide={true}
              >
                <div className="button-filter" onClick={(e) => e.preventDefault()}>
                  <FaIcon fontSize={16} icon={filter.length < 2 ? "fa-filter-circle-xmark" : "fa-filter"} />
                </div>
              </Dropdown>
            </div>
            <div id="th-label">Nhà cung cấp</div>
            <div id="th-count">Số đặt hàng</div>
            <div id="th-total">Tổng đặt hàng</div>
            <div id="th-balance">Tổng nợ mua</div>
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

export default DetailPOBalance;
