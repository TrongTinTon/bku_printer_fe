import React, { useEffect, useRef, useState } from "react";
import { Bar } from "@ant-design/plots";
import { Spin } from "antd";
import ChartHeader from "../ChartHeader";
import NoResult from "../../../NoResult";
import appGlobal from "../../../../global/AppGlobal";
import "./style.scss";
import "../style.scss";

function OneBarChart(props) {
  const { data, title, color, bageLabel, isLoading, showLegend, contentDetail, dashboard } = props;
  const dataNow = data?.[0] || [];

  const [totalNow] = data && data.map((array) => array.reduce((sum, item) => sum + item.value, 0));
  const totalFirst = dataNow[0]?.value || 0;
  const totalSecond = dataNow[1]?.value || 0;
  const countList = dataNow[0]?.count || 0;
  const xFieldValue = dataNow[0]?.xField || 0;

  const config = {
    data: dataNow,
    isStack: true,
    isPercent: true,
    xField: "value",
    yField: "xField",
    seriesField: "time",
    color: color,

    barStyle: { radius: 6 },

    state: {
      active: {
        style: {
          stroke: "#fff",
          fillOpacity: 0.65,
        },
      },
    },

    // Filter note config
    legend: showLegend
      ? {
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
        }
      : false,

    // // Horizontal field config
    xAxis: {
      line: "none",
      label: false,
      grid: {
        line: "none",
      },
    },

    // // Vectical field config
    yAxis: {
      line: "none",
      label: false,
      grid: {
        line: "none",
      },
    },

    // Tooltip popup config
    tooltip: {
      formatter: (datum) => {
        const totalData = totalNow * datum.value;
        return {
          name: datum.time,
          value:
            appGlobal.formatCurrency(totalData, 0) +
            ` <span class="value-percent">~ ${datum.value > 0 ? (datum.value * 100).toFixed(1) : 0}%</span>`,
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
      value: {
        range: [0, 1],
      },
    },
  };

  return (
    <div className="chart-container">
      <ChartHeader {...props} totalNow={totalNow} totalFirst={totalFirst} totalSecond={totalSecond} />
      {isLoading && (
        <Spin spinning={isLoading} wrapperClassName="loading-spin">
          <div style={{ height: 156 }}></div>
        </Spin>
      )}
      {dataNow.length > 0 && !isLoading ? (
        <>
          <div className="total-group-default group-space">
            <span className="total-now">{appGlobal.formatCurrency(totalNow, 0)}</span>
            {bageLabel && (
              <span className="total-bage">
                {countList} {bageLabel}
              </span>
            )}
          </div>
          {!showLegend && (
            <>
              <div className="group-space" style={{ marginTop: 10 }}>
                <div className="out-group">
                  <span className="value">{appGlobal.formatCurrency(totalFirst, 0)} ₫</span>
                  <span className="label">QUÁ HẠN</span>
                </div>
                <div className="in-group">
                  <span className="value">{appGlobal.formatCurrency(totalSecond, 0)} ₫</span>
                  <span className="label">TRONG HẠN</span>
                </div>
              </div>
            </>
          )}
          <div className={`chart-graph ${showLegend ? "showLegend-bar" : "hideLegend-bar"}`}>
            <Bar {...config} />
          </div>
          <div className="note">Số liệu tính đến: {xFieldValue}</div>
        </>
      ) : (
        !isLoading && (
          <div className="chart-graph">
            <NoResult width={"125px"} />
          </div>
        )
      )}
    </div>
  );
}

export default OneBarChart;
