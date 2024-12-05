import { Checkbox } from "antd";
import "./style.scss";

function CheckboxCustom(props) {
  const { value, label } = props;
  return (
    <Checkbox className="checkbox-custom" value={value} {...props}>
      <span className="checkbox-label">{label}</span>
    </Checkbox>
  );
}

export default CheckboxCustom;
