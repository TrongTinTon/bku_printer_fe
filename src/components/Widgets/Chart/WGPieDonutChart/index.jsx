/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Pie } from "@ant-design/charts";
import { Tooltip, Spin } from "antd";
import ChartHeader from "../ChartHeader";
import NoResult from "../../../NoResult";
import "../style.scss";
import "./style.scss";
import appGlobal from "../../../../global/AppGlobal";

function PieDonutChart(props) {
  const {
    data,
    color,
    title,
    showTotalCenter,
    shortTotalCenter,
    colorTotalCenter,
    contentDetail,
    sizeChart,
    showDiffItem,
    positionLegend,
    isLoading,
  } = props;
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
    appendPadding: [10, 0, 0, 0],
    width: sizeChart === "large" ? 200 : 150,
    height: sizeChart === "large" ? 200 : 150,
    data: dataNow,
    angleField: "value",
    colorField: "xField",
    color: color,
    radius: 1,
    innerRadius: showTotalCenter && 0.55,
    label: false,
    zIndex: 1,

    pieStyle: {
      lineWidth: 2,
    },

    legend: false,

    statistic: {
      title: {
        content: "Tổng",
        style: {
          color: "#A0AEC0",
          fontSize: sizeChart === "large" ? 14 : 12,
          lineHeight: 1.5,
        },
        offsetY: dataLast.length > 0 ? -11 : -5,
      },
      content: {
        content: shortTotalCenter ? appGlobal.shortCurrency(totalNow) : totalNow,
        style: {
          fontSize: sizeChart === "large" ? 30 : 25,
          lineHeight: 1.1,
          color: colorTotalCenter || "#04B9A7",
        },
        offsetY: dataLast.length > 0 ? -11 : -5,
      },
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
    <div className={`chart-container ${sizeChart}`}>
      <ChartHeader title={title} contentDetail={contentDetail} {...props} />
      <Spin spinning={isLoading} wrapperClassName="loading-spin">
        {dataNow.length > 0 ? (
          <div className={`chart-graph pie-group pie-legend-${positionLegend}`}>
            {showTotalCenter && dataLast.length > 0 && (
              <div className="pie-diff-container">
                <Tooltip title={`${totalNow} / ${totalLast}`} placement="top">
                  <div className={`pie-diff ${diff < 0 && "error"}`}>{diff > 0 ? `+${diff}` : `${diff}`}%</div>
                </Tooltip>
              </div>
            )}
            <Pie {...config} onReady={onReadyChart} />
            <div className="pie-legend">{renderLegend()}</div>
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
  const xFieldArray = dataNow.map((item) => item.xField);
  const [currentLegends, setCurrentLegends] = useState(xFieldArray);

  useEffect(() => {
    setCurrentLegends(xFieldArray);
  }, [dataNow]);

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
          <div className="value">{appGlobal.shortCurrency(item.value)}</div>
          {showDiffItem && dataLast.length > 0 && (
            <div className={`diff ${diffItem < 0 && "error"}`}>{diffItem > 0 ? `+${diffItem}` : `${diffItem}`}%</div>
          )}
        </div>
      </div>
    );
  });
};

export default PieDonutChart;
