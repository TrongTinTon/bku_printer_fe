/* eslint-disable react-hooks/exhaustive-deps */
import ChartHeader from "../ChartHeader";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "../../../../global/AppGlobal";
import NoResult from "../../../NoResult";
import "./style.scss";
import { Tooltip, Spin, Select } from "antd";

function RankListVectical(props) {
  const {
    data,
    title,
    showTotal,
    showCount,
    countLabel,
    subTitleIcon,
    colorFirstValue,
    colorFirstSubValue,
    colorCountRow,
    tooltipValue,
    tooltipSubValue,
    contentDetail,
    selectOption,
    handlReLoad,
    isLoading,
    dashboard,
    bodyApi,
  } = props;

  const [totalNow] = data.map((array) =>
    array.reduce((sum, item) => sum + (appGlobal.extractNumbersFromString(item.value?.[0])?.[0] ?? 0), 0)
  );

  const dataNow = data?.[0] || [];

  const renderItemRank = (item, index) => {
    const classNumRow = `num-row-${index + 1}`;
    const imgUrl = item?.imgUrl;
    return (
      <div className="list-v-item" key={index}>
        <div className="left-group">
          <div className={`num-row ${colorCountRow && classNumRow}`}>{index + 1}</div>
          {item.imgUrl && (
            <div className="image">
              <img src={`https://quocduygroup.com/vtiger/${imgUrl}`} />
            </div>
          )}
          <div className={`item-title-group ${(item.status || item.imgUrl) && "title-status"}`}>
            <div className="item-title">
              <Tooltip title={item.title} placement="top">
                <span className="title">{item.title}</span>
              </Tooltip>
              {item.status && <div className={`bage ${item.statusType}`}>{item.status}</div>}
            </div>
            <div className="item-sub-title">
              {subTitleIcon && <FaIcon color="#A0AEC0" fontSize={10} icon={subTitleIcon} />}
              <span className="sub-title">{item.subTitle}</span>
            </div>
          </div>
        </div>
        <div className="right-group">
          {item.value && item.value.length > 0 && (
            <Tooltip title={tooltipValue} placement="top">
              <div className="value">
                <span style={{ color: colorFirstValue }}>{item.value?.[0] ?? 0}</span>{" "}
                {item.value?.[1] ? `/ ${item.value?.[1]}` : ""}
              </div>
            </Tooltip>
          )}
          {item.subValue && item.subValue.length > 0 && (
            <Tooltip title={tooltipSubValue} placement="top">
              <div className="bage-value">
                <span style={{ color: colorFirstSubValue }}>{item.subValue?.[0] ?? 0}</span>{" "}
                {item.subValue?.[1] ? `/ ${item.subValue?.[1]}` : ""}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <ChartHeader
        title={title}
        selectOption={selectOption}
        dashboard={dashboard}
        handlReLoad={handlReLoad}
        bodyApi={bodyApi}
        contentDetail={contentDetail}
      />
      {isLoading && (
        <Spin spinning={isLoading} wrapperClassName="loading-spin">
          <div style={{ height: 156 }}></div>
        </Spin>
      )}
      {dataNow.length > 0 && !isLoading ? (
        <>
          {showTotal && (
            <div className="total-group-default group-space">
              <span className="total-now">{appGlobal.formatCurrency(totalNow, 0)}</span>
              {showCount && (
                <span className="total-bage">
                  {dataNow.length} {countLabel}
                </span>
              )}
            </div>
          )}
          <div className="list-v-container">
            {dataNow.map((item, index) => {
              return renderItemRank(item, index);
            })}
          </div>
        </>
      ) : (
        !isLoading && <NoResult width={"125px"} />
      )}
    </div>
  );
}

export default RankListVectical;
