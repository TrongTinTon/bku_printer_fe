import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { Spin, Tooltip } from "antd";
import NoResult from "../../../NoResult";
import "./style.scss";

function TagBage({ data, isLoading }) {
  const dataNow = data?.[0];

  if (dataNow?.length > 0) {
    return (
      <div className="group-tab-bage">
        {dataNow.map((item, index) => {
          return (
            <Spin key={index} spinning={isLoading} wrapperClassName="loading-spin-bage">
              <div className="chart-bage" key={index}>
                <div className="title-group">
                  <span className="title">
                    {dataNow[index].title}{" "}
                    {dataNow[index].time && (
                      <Tooltip title={dataNow[index].time} placement="top">
                        <span className="time">
                          <FaIcon fontSize={12} icon="fa-regular fa-clock" />
                        </span>
                      </Tooltip>
                    )}
                  </span>
                  <span className="value">{dataNow[index].value}</span>
                </div>
                <div className="image">
                  <img src={item.iconSrc} />
                </div>
              </div>
            </Spin>
          );
        })}
      </div>
    );
  }

  return !isLoading && dataNow?.length == 0 ? (
    <div className="chart-container">
      <NoResult width={150} />
    </div>
  ) : (
    <div className="chart-container">
      <Spin spinning={isLoading} wrapperClassName="loading-spin">
        <div style={{ height: 156 }}></div>
      </Spin>
    </div>
  );
}

export default TagBage;
