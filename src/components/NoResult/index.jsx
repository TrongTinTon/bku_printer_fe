import ServerUrl from "../../constants/ServerUrl";
import "./styles.scss";

function NoResult({ width, height, style }) {
  return (
    <div className="no-result" style={{ ...style }}>
      <img src={ServerUrl.urlSub + `assets/icon/NoResults.svg`} width={width} height={height} />
      <div className="no-result_text">Không có dữ liệu</div>
    </div>
  );
}

export default NoResult;
