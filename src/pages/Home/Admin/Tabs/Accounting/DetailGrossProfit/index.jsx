/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrossProfit } from "src/store/module/dashboardAction";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Pagination, Tooltip, Spin, Skeleton } from "antd";
import appGlobal from "../../../../../../global/AppGlobal";
import "./style.scss";

function DetailGrossProfit({ totalNow }) {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.module.dashboard);

  const isFirstLoading = useRef(true);
  const totalCount = useRef(0);
  const totalSale = useRef(0);
  const { timeNow } = dashboard;
  const startNow = timeNow.value[0];
  const endNow = timeNow.value[1];

  const percentGross = (totalNow / totalSale.current) * 100;
  const percentCost = ((totalSale.current - totalNow) / totalSale.current) * 100;

  const [listData, setListData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (timeOption, page) => {
      setLoading(true);
      const body = {
        mode: "detail",
        page: page,
        ...timeOption,
      };

      const data = await dispatch(getGrossProfit(body));

      if (data) {
        setListData(data);
        setLoading(false);
        isFirstLoading.current = false;
        totalCount.current = data.now.totalCount;
        totalSale.current = data.now.totalSales;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData({
      timeBetween: { start: startNow, end: endNow, label: "" },
      page: 1,
    });
  }, [dashboard, fetchData]);

  const handleNextPage = (page, pageSize) => {
    fetchData({
      timeBetween: { start: startNow, end: endNow, label: "" },
      page: page,
    });
  };

  const renderList = () => {
    const datas = listData?.now?.data || [];
    return (
      datas.length > 0 &&
      !isLoading &&
      datas.map((item, index) => {
        return renderRowItem(item, index);
      })
    );
  };

  const renderRowItem = (item, index) => {
    const userImg = item?.smownerid.imgUrl;
    const userName = item?.smownerid.label;

    const listPrice = item.totalListPrice;
    const grossProfit = item.totalGrossProfit;
    const percent = (grossProfit / listPrice) * 100;

    return (
      <tr key={index} style={{ height: 66 }}>
        <td className="group-label">
          <Tooltip title={item.subject} placement="top" zIndex={10700}>
            <a
              href={`https://quocduygroup.com/vtiger/index.php?module=SalesOrder&view=Detail&record=${item.crmid}`}
              target="_blank"
              className="label"
            >
              {item.subject}
            </a>
          </Tooltip>
          <Tooltip title={item.accountname} placement="top" zIndex={10700}>
            <div className="account">{item.accountname}</div>
          </Tooltip>
        </td>
        <td id="td-created-date">
          <span>{appGlobal.convertToServerTime(item.createdtime, "DD-MM-YYYY")}</span>
        </td>
        <td>
          <Tooltip title={userName} placement="top" zIndex={10700}>
            <div className="owner-img">
              <img src={`https://quocduygroup.com/vtiger/${userImg}`} />
            </div>
          </Tooltip>
        </td>
        <td id="td-total">
          <span>{appGlobal.formatCurrency(listPrice, 0)}</span>
        </td>
        <td id="td-cost">
          <span className="error">-{appGlobal.formatCurrency(item.totalPurchaseCost, 0)}</span>
        </td>
        <td id="td-gross">
          <span className={grossProfit > 0 ? "success" : "error"}>
            {grossProfit > 0 ? "+" : ""}
            {appGlobal.formatCurrency(grossProfit, 0)} ({percent.toFixed(1)}%)
          </span>
        </td>
      </tr>
    );
  };

  const renderItemPagination = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <a>
          <FaIcon fontSize={16} icon="fa-angle-left" />
        </a>
      );
    }
    if (type === "next") {
      return (
        <a>
          <FaIcon fontSize={16} icon="fa-angle-right" />
        </a>
      );
    }
    return originalElement;
  };

  return (
    <div className="gross-profit">
      <div className="gross-profit-header">
        <div className="group-value">
          {isFirstLoading.current ? (
            <>
              <Skeleton.Input active={isFirstLoading.current} size="small" />
              <div style={{ height: 5 }} />
              <Skeleton.Button active={isFirstLoading.current} size="small" shape="round" />
            </>
          ) : (
            <>
              <div className="value">₫ {appGlobal.formatCurrency(totalSale.current, 0)}</div>
              <div className="title">Doanh số</div>
            </>
          )}
        </div>

        <div className="group-value">
          {isFirstLoading.current ? (
            <>
              <Skeleton.Input active={isFirstLoading.current} size="small" />
              <div style={{ height: 5 }} />
              <Skeleton.Button active={isFirstLoading.current} size="small" shape="round" />
            </>
          ) : (
            <>
              <div className="value">
                ₫ {appGlobal.formatCurrency(totalSale.current - totalNow, 0)}
                <span className="percent"> ({percentCost.toFixed(1)}%)</span>
              </div>
              <div className="title">Giá vốn</div>
            </>
          )}
        </div>

        <div className="group-value">
          {isFirstLoading.current ? (
            <>
              <Skeleton.Input active={isFirstLoading.current} size="small" />
              <div style={{ height: 5 }} />
              <Skeleton.Button active={isFirstLoading.current} size="small" shape="round" />
            </>
          ) : (
            <>
              <div className={`value ${totalNow > 0 && "success"}`}>
                ₫ {appGlobal.formatCurrency(totalNow, 0)}
                <span className={`percent ${totalNow > 0 && "success"}`}> ({percentGross.toFixed(1)}%)</span>
              </div>
              <div className="title">Lãi gộp</div>
            </>
          )}
        </div>
      </div>
      <Spin spinning={isLoading} wrapperClassName="loading-spin-gross">
        <div className="gross-profit-body">
          <table id="gross-table">
            <thead className="table-header">
              <tr>
                <th id="th-label">Tiêu đề đơn hàng</th>
                <th id="th-created-date">Ngày tạo</th>
                <th id="th-owner">Gán cho</th>
                <th id="th-total">Tổng giá</th>
                <th id="th-cost">Giá vốn</th>
                <th id="th-gross">Lãi gộp</th>
              </tr>
            </thead>
            <tbody>
              {renderList()}
              <tr></tr>
            </tbody>
          </table>
        </div>
      </Spin>
      <div className="pagination">
        <div className="total-count">Tổng: {totalCount.current}</div>
        <Pagination
          total={totalCount.current || 10}
          defaultPageSize={10}
          defaultCurrent={1}
          showSizeChanger={false}
          itemRender={renderItemPagination}
          onChange={handleNextPage}
        />
      </div>
    </div>
  );
}

export default DetailGrossProfit;
