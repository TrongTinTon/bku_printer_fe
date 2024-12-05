import React, { useRef, useState } from "react";
import { Rose } from "@ant-design/plots";
import { Tooltip, Spin } from "antd";
import ChartHeader from "../ChartHeader";
import NoResult from "../../../NoResult";
import "../style.scss";
import "./style.scss";

function RoseChart({
  data,
  color,
  title,
  showTotalCenter,
  colorTotalCenter,
  contentDetail,
  showDiffItem,
  positionLegend,
  isLoading,
}) {
  const plotRef = useRef(null);

  const dataNow = data?.[0] || [];
  const dataLast = data?.[1] || [];

  const [totalNow, totalLast] = data.map((array) => array.reduce((sum, item) => sum + item.value, 0));
  const diff = totalLast > 0 ? (((totalNow - totalLast) / totalLast) * 100).toFixed() : "100";

  const onReadyChart = (plot) => {
    plotRef.current = plot;
  };
  const renderLegend = () => {
    return <Legend dataNow={dataNow} dataLast={dataLast} plotRef={plotRef} color={color} showDiffItem={showDiffItem} />;
  };

  const config = {
    data: dataNow,
    appendPadding: [10, 0, 0, 0],
    width: 150,
    height: 150,
    yField: "value",
    xField: "xField",
    seriesField: "xField",
    innerRadius: showTotalCenter && 0.55,
    color: color,
    radius: 1,

    legend: false,
    label: false,

    yAxis: {
      line: "none",
      label: false,
      grid: {
        line: {
          style: {
            stroke: "#EBEFF5",
            lineDash: [5, 5],
          },
        },
      },
      tickCount: 4,
    },

    // Tooltip popup config
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.xField,
          value:
            datum.value +
            ` <span class="value-percent">~ ${
              datum.value > 0 ? ((datum.value / totalNow) * 100).toFixed(0) : 0
            }%</span>`,
        };
      },
      domStyles: {
        "g2-tooltip": {
          padding: "5px 20px",
          borderRadius: "12px",
          boxShadow: "0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.12)",
          width: "max-content",
        },
        "g2-tooltip-title": {
          fontWeight: 700,
        },
        "g2-tooltip-value": {
          fontWeight: 500,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <ChartHeader title={title} contentDetail={contentDetail} />
      <Spin spinning={isLoading} wrapperClassName="loading-spin">
        {dataNow.length > 0 ? (
          <div className={`chart-graph rose-group rose-legend-${positionLegend}`}>
            {showTotalCenter && (
              <div className="rose-diff-container">
                <div className="total-label">Tổng</div>
                <div className="total-value" style={{ color: colorTotalCenter }}>
                  {totalNow}
                </div>
                {dataLast.length > 0 && (
                  <Tooltip title={`${totalNow} / ${totalLast}`} placement="bottom">
                    <div className={`rose-diff ${diff < 0 && "error"}`}>{diff > 0 ? `+${diff}` : `${diff}`}%</div>
                  </Tooltip>
                )}
              </div>
            )}
            <Rose {...config} onReady={onReadyChart} />
            <div className="rose-legend">{renderLegend()}</div>
          </div>
        ) : (
          <div className="chart-graph">
            <NoResult width={"125px"} />
          </div>
        )}
      </Spin>
    </div>
  );
}

const Legend = ({ dataNow, dataLast, plotRef, color, showDiffItem }) => {
  const [currentLegends, setCurrentLegends] = useState(dataNow.map((item) => item.xField));

  const onPressLegend = (type) => {
    const plot = plotRef.current;
    if (!plot) return;
    const newLegends = [...currentLegends];
    const exist = newLegends.includes(type);
    if (exist) {
      newLegends.splice(newLegends.indexOf(type), 1);
    } else {
      newLegends.push(type);
    }
    if (newLegends.length > 0) {
      setCurrentLegends(newLegends);
      plot.chart.filter("type", (_, item) => newLegends.includes(item.xField));
      plot.chart.render(true);
    }
  };

  return dataNow.map((item, index) => {
    const isShow = currentLegends.includes(item.xField);
    const itemTotalLast = dataLast[index]?.value;
    const diffItem = itemTotalLast > 0 ? (((item.value - itemTotalLast) / itemTotalLast) * 100).toFixed() : "100";
    return (
      <div
        key={index}
        className={`legend-item ${isShow ? "" : "hide"}`}
        onClick={() => {
          onPressLegend(item.xField);
        }}
      >
        <div className="group-name">
          <div className="marker" style={{ background: color[index] }} />
          <div className="name">{item.xField}</div>
        </div>

        <div className="group-value">
          <div className="value">{item.value}</div>
          {showDiffItem && dataLast.length > 0 && (
            <Tooltip title={`${item.value} / ${itemTotalLast}`} placement="top">
              <div className={`diff ${diffItem < 0 && "error"}`}>{diffItem > 0 ? `+${diffItem}` : `${diffItem}`}%</div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  });
};

export default RoseChart;
