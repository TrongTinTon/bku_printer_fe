import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import appGlobal from "../../../../global/AppGlobal";
import NoResult from "../../../NoResult";
import ChartHeader from "../ChartHeader";
import { Tooltip, Spin } from "antd";
import ServerUrl from "../../../../constants/ServerUrl";
import "./style.scss";

function RankListHorizal({ title, data, sortBy, showUnit, showCup, showStar, contentDetail, isLoading }) {
  const indexToTopClass = [4, 2, 1, 3];
  const starTooltips = { 1: "Kém", 2: "Kém", 3: "Trung bình", 4: "Tốt", 5: "Xuất sắc" };

  const dataNow = data?.[0] || [];
  const dataLast = data?.[1] || [];

  const [totalNow, totalLast] = data.map((array) => array.reduce((sum, item) => sum + item.total, 0));
  const [successNow, successLast] = data.map((array) => array.reduce((sum, item) => sum + item?.success, 0));
  const diff = totalLast > 0 ? (((totalNow - totalLast) / totalLast) * 100).toFixed() : "100";

  const sortDataNow = appGlobal.sortTop5ToMidArray(dataNow, sortBy || "total");

  const renderItemRank = (item, index) => {
    const { smownerid, success, total, star } = item;
    let topClass = index + 1;

    if (index >= 0 && index < indexToTopClass.length) {
      topClass = indexToTopClass[index];
    }
    const userName = smownerid?.label ? appGlobal.shortenedName(smownerid.label) : "--";
    const imgUrl = smownerid?.imgUrl || "layouts/v7/skins/images/defautAvatar.png";
    const userId = smownerid?.value;
    const userDiff = dataLast.filter((item) => item.smownerid.value === userId);
    const itemTotalLast = userDiff[0]?.total || 0;
    const itemSuccessLast = userDiff[0]?.success || 0;

    const tooltipLastInfo = !showUnit
      ? `${itemSuccessLast} / ${itemTotalLast}`
      : appGlobal.shortCurrency(itemTotalLast, 1, true);

    const tooltipStar = starTooltips[star] || "Chưa có hạng";

    return (
      <div className={`ranklist-item top-${topClass}`}>
        {showCup &&
          (topClass <= 3 ? (
            <img src={ServerUrl.urlSub + `assets/images/CupTop${topClass}.png`} width={topClass === 1 ? 25 : 20} />
          ) : (
            <div className="bage bage-bg">{topClass}</div>
          ))}

        {showStar && !showCup && (
          <Tooltip title={tooltipStar} placement="top">
            <div className={`star-group ${!star && "no-star"}`}>
              {star && <span className="num-star">{star}</span>}
              <img src="..icon/StarSolid.svg" />
            </div>
          </Tooltip>
        )}

        <div className="avartar-container gradient-bg">
          <img className="avatar" src={`https://quocduygroup.com/vtiger/${imgUrl}`} />
        </div>
        {!showCup && <div className="bage bage-bg">{topClass}</div>}
        <div className="user-name">{userName}</div>
        <div className="score-bage">
          {!showUnit ? (
            <>
              <span className="now-total">{success}</span>
              <span className="total">/ {appGlobal.shortCurrency(total, 0, true)}</span>
            </>
          ) : (
            <span className="total total-unit">{showUnit ? appGlobal.shortCurrency(total, 1, true) : total}</span>
          )}

          {dataLast.length > 0 && (
            <Tooltip title={tooltipLastInfo} placement="bottom">
              {success >= itemSuccessLast ? (
                <FaIcon color="#33BA35" fontSize={9} icon="fa-up-long" />
              ) : (
                <FaIcon color="#F63A46" fontSize={9} icon="fa-down-long" />
              )}
            </Tooltip>
          )}
        </div>
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
      {sortDataNow.length > 0 && !isLoading ? (
        <>
          {!showCup && !showStar && (
            <div className="total-group-default">
              <span className="total-now">
                {successNow ? (
                  <>
                    <span className="total-success">{successNow}</span> / {totalNow}
                  </>
                ) : (
                  totalNow
                )}
              </span>
              {dataLast.length > 0 && (
                <Tooltip title={`${successLast} / ${totalLast}`} placement="bottom">
                  <span className={`total-last ${diff < 0 && "error"}`}>{diff > 0 ? `+${diff}` : `${diff}`}%</span>
                </Tooltip>
              )}
            </div>
          )}
          <div className="ranklist-container">
            {sortDataNow.map((item, index) => {
              return <div key={index}>{renderItemRank(item, index)}</div>;
            })}
          </div>
        </>
      ) : (
        !isLoading && <NoResult width={"125px"} />
      )}
    </div>
  );
}

export default RankListHorizal;
