import { Segmented } from "antd";
import "./style.scss";

function SegmentedCustom(props) {
  return <Segmented className="segmented-custom" size="large" {...props} />;
}

export default SegmentedCustom;
