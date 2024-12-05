import React from "react";
import { Column } from "@ant-design/plots";
import { Tooltip, Spin } from "antd";
import NoResult from "../../../NoResult";
import ChartHeader from "../ChartHeader";
import "../style.scss";
import appGlobal from "../../../../global/AppGlobal";

function DualColumnChart(props) {
  const { data, sizeChart, isGroup, color, isLoading, showTotal = true, positionLegend } = props;

  const color1 = color ? color[0] : "#A0AEC0";
  const color2 = color ? color[1] : "#DEE3E9";

  const dataNow = data?.[0] || [];
  const dataLast = data?.[1] || [];
  const dataFormat = [...(data?.[0] || []), ...(data?.[1] || [])];

  const [totalNow, totalLast] = data.map((array) => array.reduce((sum, item) => sum + item.value, 0));
  const diff = totalLast > 0 ? (((totalNow - totalLast) / totalLast) * 100).toFixed() : "100";

  const checkItemTooltip = (string) => {
    const isInArray1 = dataNow.some((item) => item.time === string);
    const isInArray2 = dataLast.some((item) => item.time === string);

    if (isInArray1) return totalNow;
    if (isInArray2) return totalLast;
    return 1;
  };

  const config = {
    data: dataFormat,
    xField: "xField",
    yField: "value",
    appendPadding: [5, 0, 0, 0],

    // Chart render
    color: [color1, color2],
    isGroup: isGroup,
    maxColumnWidth: dataFormat.length > 2 && 20,
    columnStyle: {
      radius: dataNow.length > 9 || dataLast.length > 9 ? [3, 3, 0, 0] : [4, 4, 0, 0],
    },
    dodgePadding: dataFormat.length > 2 ? 0 : -1,
    seriesField: "time",
    state: {
      active: {
        style: {
          stroke: "#fff",
          fillOpacity: 0.65,
        },
      },
    },

    // Filter note config
    legend: {
      position: positionLegend || "top-right",
      marker: {
        symbol: "circle",
        spacing: 10,
        style: (item) => {
          return {
            fill: item.fill,
            r: 4,
          };
        },
      },
      itemName: true,
      itemHeight: 7,
      itemSpacing: 20,
    },

    // Horizontal field config
    xAxis: {
      line: {
        style: {
          stroke: "#E2E8F0",
          opacity: 0.5,
        },
      },
      label: {
        style: {
          fill: "#CBD5E0",
          fontSize: 10,
          fontWeight: 500,
        },
        offsetY: 7,
      },
      grid: {
        line: "none",
      },
    },

    // Vectical field config
    yAxis: {
      value: "value",
      line: "none",
      label: {
        formatter: (text) => {
          return appGlobal.shortCurrency(text, 0, true);
        },
        style: {
          fill: "#CBD5E0",
          fontSize: 10,
          fontWeight: 500,
        },
        offsetX: -7,
      },
      grid: {
        line: {
          style: {
            stroke: "#E2E8F0",
            lineDash: [5, 5],
          },
        },
      },
      tickCount: 4,
      state: {
        active: {
          style: {
            lineWidth: 0,
            fillOpacity: 0.65,
          },
        },
      },
    },

    // Tooltip popup config
    tooltip: {
      formatter: (datum) => {
        const totalData = checkItemTooltip(datum.time);
        return {
          name: datum.time,
          value:
            appGlobal.formatCurrency(datum.value, 0) +
            ` <span class="value-percent">~ ${
              datum.value > 0 ? ((datum.value / totalData) * 100).toFixed(0) : 0
            }%</span>`,
        };
      },
      domStyles: {
        "g2-tooltip": {
          padding: "5px 20px",
          borderRadius: "12px",
          boxShadow: "0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.12)",
        },
        "g2-tooltip-title": {
          fontWeight: 700,
        },
        "g2-tooltip-value": {
          fontWeight: 500,
        },
      },
    },

    interactions: [
      {
        type: "element-active",
      },
    ],

    // Chart start - end position
    meta: {
      xField: dataFormat.length > 5 && {
        sync: false,
        range: [0.08, 0.936],
      },
    },
  };

  return (
    <div className={`chart-container ${sizeChart}`}>
      <ChartHeader {...props} totalNow={totalNow} />
      <Spin spinning={isLoading} wrapperClassName="loading-spin">
        {dataNow.length > 0 ? (
          <>
            {showTotal && (
              <div className="total-group">
                <span className="total-now">{appGlobal.formatCurrency(totalNow, 0)}</span>
                <Tooltip
                  title={`${appGlobal.formatCurrency(totalNow, 0)} / ${appGlobal.formatCurrency(totalLast, 0)}`}
                  placement="bottom"
                >
                  <span className={`total-last ${diff < 0 && "error"}`}>{diff > 0 ? `+${diff}` : `${diff}`}%</span>
                </Tooltip>
              </div>
            )}
            <div className="chart-graph">
              <Column {...config} />
            </div>
          </>
        ) : (
          <div className="chart-graph">
            <NoResult width={"125px"} />
          </div>
        )}
      </Spin>
    </div>
  );
}

export default DualColumnChart;
