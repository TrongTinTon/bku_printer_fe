import ServerUrl from "../../constants/ServerUrl";
import "./styles.scss";

function EmptyList({ module, width = "200px", height = "200px" }) {
  return (
    <div className="emptyList">
      <img src={ServerUrl.urlSub + `assets/icon/Empty.svg`} width={width} height={height} />
      <div className="emptyList_text">{!module ? `Danh sách trống!` : `Chưa có ${module} nào!`}</div>
    </div>
  );
}

export default EmptyList;
