import React, { useEffect, useRef, useState } from "react";
import { DualAxes } from "@ant-design/plots";
import { Tooltip, Spin } from "antd";
import ChartHeader from "../ChartHeader";
import NoResult from "../../../NoResult";
import "../style.scss";
import appGlobal from "../../../../global/AppGlobal";

function ColumnLineChart(props) {
  const { data, title, color, contentDetail, isLoading, sizeChart } = props;
  const chartType1 = "column";
  const chartType2 = "line";
  const color1 = color?.[0] || "#A0AEC0";
  const color2 = color?.[1] || "#DEE3E9";

  const dataNow = data?.[0] || [];
  const dataLast = data?.[1] || [];

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
    data: [dataNow, dataLast],
    xField: "xField",
    yField: ["value", "value"],
    appendPadding: [5, 0, 0, 0],

    // Chart render
    geometryOptions: [
      {
        geometry: chartType1,
        color: color1,
        maxColumnWidth: 25,
        columnStyle: {
          radius: dataNow.length > 10 ? [3, 3, 0, 0] : [4, 4, 0, 0],
        },
        seriesField: "time",
        state: {
          active: {
            style: {
              stroke: "#fff",
              fillOpacity: 0.65,
            },
          },
        },
      },
      {
        geometry: chartType2,
        smooth: true,
        color: color2,
        lineStyle: {
          lineWidth: 3,
          strokeOpacity: 0.7,
        },
        point: () => {
          return {
            shape: "circle",
            size: 4,
          };
        },
        seriesField: "time",
      },
    ],

    // Filter note config
    legend: {
      position: "top-right",
      marker: {
        symbol: "circle",
        spacing: 10,
        style: (item) => {
          return {
            fill: item.fill || item.stroke,
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
      line: "none",
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
    yAxis: [
      {
        value: "value",
        line: "none",
        position: "left",
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
      },

      {
        value: "value",
        line: "none",
        position: "right",
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
          line: "none",
        },
        tickCount: 4,
      },
    ],

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
      xField: {
        range: [0.045, 0.956],
      },
    },
  };

  return (
    <div className={`chart-container ${sizeChart}`}>
      <ChartHeader title={title} contentDetail={contentDetail} {...props} />
      <Spin spinning={isLoading} wrapperClassName="loading-spin">
        {dataNow.length > 0 ? (
          <>
            <div className="total-group">
              <span className="total-now">{appGlobal.formatCurrency(totalNow, 0)}</span>
              <Tooltip
                title={`${appGlobal.formatCurrency(totalNow, 0)} / ${appGlobal.formatCurrency(totalLast, 0)}`}
                placement="bottom"
              >
                <span className={`total-last ${diff < 0 && "error"}`}>{diff > 0 ? `+${diff}` : `${diff}`}%</span>
              </Tooltip>
            </div>
            <div className="chart-graph">
              <DualAxes {...config} />
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

export default ColumnLineChart;
