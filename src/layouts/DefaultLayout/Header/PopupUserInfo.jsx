import { forwardRef } from "react";
import { Button, Avatar } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import DividerCustom from "src/components/Divider";
import configApp from "src/configApp";

const PopupUserInfo = forwardRef(({ userInfo, onPressLogout, imgUrl }, ref) => {
  const userName = `${userInfo.username}`;
  const roleName = userInfo.roleName;
  const email = userInfo.email;

  return (
    <div className="dropdown-content">
      <div className="container">
        <Avatar src={<img src={imgUrl} alt="avatar" />} />
        <p className="container_userName">{userName.trim()}</p>
        <p className="container_role">{roleName}</p>
        <p className="container_email">{email}</p>

        <DividerCustom />

        {/* <Button type="text" icon={<FaIcon icon="fa-circle-user" />}>
          Hồ sơ của tôi
        </Button> */}
        <Button
          type="text"
          icon={<FaIcon icon="fa-right-from-bracket" />}
          className="btnLogout"
          onClick={onPressLogout}
        >
          Đăng xuất
        </Button>

        <DividerCustom />

        <div className="container_email">
          Phiên bản v{configApp.version} <FaIcon icon="fa-regular fa-copyright" style={{ color: "#7e90afe6" }} />{" "}
          BKU Studutents Dev
        </div>
      </div>
    </div>
  );
});

export default PopupUserInfo;
