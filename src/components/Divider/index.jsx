import { Divider } from "antd";
import "./styles.scss";

function DividerCustom(props) {
  return <Divider className={`divider-custom ${props.className}`} {...props} />;
}

export default DividerCustom;
