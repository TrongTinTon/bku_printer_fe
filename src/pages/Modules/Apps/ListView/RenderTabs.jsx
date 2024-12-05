import { useDispatch, useSelector } from "react-redux";

function RenderTabs(props) {
  const { viewName, module, tabKey } = props;
  const listConfig = useSelector((state) => state.module.listviewCount[module.name]);
  const tabInfo = listConfig && listConfig.filter((item) => item.cvid === tabKey)[0];
  const countNum = tabInfo && tabInfo.totalCount;
  const cvid = tabInfo && tabInfo.cvid;
  return (
    <>
      {viewName}

      <span
        id={`count-tab-value-${cvid}`}
        className="count-label-tab"
        style={{ display: countNum > 0 ? "unset" : "none" }}>
        {countNum}
      </span>
    </>
  );
}

export default RenderTabs;
