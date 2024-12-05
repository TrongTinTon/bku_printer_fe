import { Line } from "@ant-design/charts";
import { Area } from "@ant-design/plots";
import { Tooltip, Spin } from "antd";
import NoResult from "../../../NoResult";
import ChartHeader from "../ChartHeader";
import "../style.scss";
import appGlobal from "../../../../global/AppGlobal";

function AreaChart(props) {
  const { data, color, title, isLoading, contentDetail } = props;
  const formatData = data.flat();
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

  const isInDataNow = (item) => dataNow.some((dataItem) => JSON.stringify(dataItem) === JSON.stringify(item));

  const colors = color || ["#A0AEC0", "#DEE3E9"];

  const config = {
    data: formatData,
    xField: "xField",
    yField: "value",
    seriesField: "time",
    smooth: true,
    color: colors,
    appendPadding: [5, 0, 0, 0],

    lineStyle: {
      lineWidth: 3,
    },

    areaStyle: (item) => {
      const index = isInDataNow(item) ? 0 : 1;
      const color2 = colors[index];
      return {
        fill: `l(270) 0:#fff 0.7:${color2} 1:${color2}`,
        fillOpacity: 0.3,
      };
    },

    legend: {
      position: "top-right",
      marker: {
        symbol: "circle",
        spacing: 10,
        style: (item) => {
          return {
            fill: item.stroke,
            r: 4,
          };
        },
      },
      itemName: true,
      itemHeight: 7,
      itemSpacing: 20,
    },

    point: {
      shape: "circle",
      size: 4,
      state: {
        active: {
          style: {
            lineWidth: 1,
            stroke: "#fff",
          },
        },
      },
    },

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
        line: {
          style: {
            stroke: "#E2E8F0",
            lineDash: [5, 5],
          },
        },
      },
    },

    yAxis: {
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
        line: "none",
      },
      tickCount: 4,
    },

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

      // showCrosshairs: true,
      // crosshairs: {
      //   type: "xy",
      //   follow: true,
      //   line: {
      //     style: {
      //       lineWidth: 0.5,
      //       stroke: "rgba(0,0,0,0.2)",
      //     },
      //   },
      // },
    },

    meta: {
      xField: {
        range: [0, 1],
      },
    },
  };

  return (
    <div className="chart-container">
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
              <Area {...config} />
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

export default AreaChart;
