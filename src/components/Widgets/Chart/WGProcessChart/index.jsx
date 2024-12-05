import NoResult from "../../../NoResult";
import { Tooltip, Progress, Spin } from "antd";
import ChartHeader from "../ChartHeader";
import "./style.scss";

function ProcessChart({ title, data, showDiffItem, isLoading, contentDetail }) {
  const dataNow = data?.[0] || [];
  const dataLast = data?.[1] || [];

  const [totalNow, totalLast] = data.map((array) => array.reduce((sum, item) => sum + item.value, 0));

  const renderItemRank = (item, index) => {
    const percent = ((item.value / totalNow) * 100).toFixed(1);
    const itemTotalLast = dataLast.find((itemLast) => itemLast.xField === item.xField);
    const valueLast = itemTotalLast?.value || 0;
    const diffItem = valueLast > 0 ? (((item.value - valueLast) / valueLast) * 100).toFixed() : "100";
    return (
      <div className="list-item" key={index}>
        <div className="label-group">
          <span className="label">{item.xField}</span>
          <div className="value-group">
            <span className="percent">{percent}%</span>
            {showDiffItem && dataLast.length > 0 && (
              <Tooltip title={`${item.value} / ${valueLast}`} placement="top">
                <span className={`diff ${diffItem < 0 && "error"}`}>
                  {diffItem > 0 ? `+${diffItem}` : `${diffItem}`}%
                </span>
              </Tooltip>
            )}
          </div>
        </div>
        <Progress percent={percent} showInfo={false} strokeColor={"#64748B"} trailColor={"#E2E8F0"} />
      </div>
    );
  };

  return (
    <div className="chart-container">
      <ChartHeader title={title} contentDetail={contentDetail} />
      {isLoading && (
        <Spin spinning={isLoading} wrapperClassName="loading-spin">
          <div style={{ height: 156 }}></div>
        </Spin>
      )}
      {dataNow.length > 0 && !isLoading ? (
        <>
          <div className="list-process-container">
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

export default ProcessChart;
