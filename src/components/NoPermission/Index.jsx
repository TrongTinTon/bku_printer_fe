import ServerUrl from "../../constants/ServerUrl";
import "./styles.scss";

function NoPermission({ module, width = "160px", height = "160px" }) {
  return (
    <div className="no-permission">
      <img src={ServerUrl.urlSub + `assets/icon/NoPermission.svg`} width={width} height={height} />
      <div className="no-permission_text">Bạn không có quyền xem {module}!</div>
    </div>
  );
}

export default NoPermission;
