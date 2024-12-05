import { useState, useEffect, useRef } from "react";
import { Button, Modal } from "antd";
import { useDispatch } from "react-redux";
import { login } from "src/store/account/actions";
import { useNavigate, useLocation } from "react-router-dom";
import ServerUrl from "src/constants/ServerUrl";
import "./style.scss";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  let logo = `${ServerUrl.urlSub}assets/images/bku_logo.svg`;
  const [responseLogin, setResponseLogin] = useState({
    success: true,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const redirectPath = `${location.state?.path}${location.state?.search}` || "/"; //Redirect về url mà mới bị logout

  const onPressLogin = async (values) => {
    if (responseLogin.success) {
      setLoading(true);
      const loginApi = await dispatch(login(values?.email, values?.password));

      if (loginApi.status == "success") {
        navigate(redirectPath, { replace: true });
        setLoading(false);
      } else {
        setResponseLogin({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng.",
        });
        setLoading(false);
      }
    }
  };

  const handleSSOPage = () => {
    setOpen(true)
  };

  const handleCancel = () => {
    setOpen(false)
  };

  return (
    <div>
      <div className="login-container">
        <div>
          <div className="logo">
            <img className="logo_src" src={logo} />
            <div className="logo_appInfo">
              <p className="logo_appInfo_title">Hệ thống in thông minh</p>
              <p className="logo_appInfo_subTitle" >Dịch vụ tiện ích</p>
            </div >
          </div>
        </div>
        <div className="tilte">Đăng nhập</div>
        <div className="wrap-btn">
          <Button
            onClick={handleSSOPage}
            icon={<img src={ServerUrl.urlSub + `assets/icon/user.svg`} />}
            loading={loading}
            className="login-btn"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
      <Modal
        className="modal"
        open={open}
        onCancel={handleCancel}
        width={1000}
        footer={""}
      >
        <div className="sso-page">
          <div className="sso-page_header">

          </div>
          <div className="sso-page_body">
            <div className="sso-login-form">
              <div className="sso-login-form_top">
                <img src={ServerUrl.urlSub + `assets/icon/logoBK-White.svg`} />
              </div>
              <div className="sso-login-form_main">
                <div className="label">Log in using your account on:</div>
                <Button
                  onClick={() => onPressLogin({ email: "tin.tontrong@hcmut.edu.vn" })}
                  icon={<img src={ServerUrl.urlSub + `assets/icon/logoBK-White.svg`} />}
                  loading={loading}
                  className="sso-btn"
                >
                  Tài khoản HCMUT (HCMUT account)
                </Button>
                <Button
                  onClick={() => onPressLogin({ email: "qly@gmail.com" })}
                  loading={loading}
                  className="sso-btn"
                >
                  Admin
                </Button>
              </div>
              <div className="sso-login-form_footer"></div>
            </div>
          </div>
          <div className="sso-page_footer">

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Login;
