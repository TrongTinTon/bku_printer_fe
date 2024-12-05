import React, { memo, useState, useEffect, useCallback } from "react";
import { Collapse, Anchor } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import RenderBlockFields from "./RenderBlockFields";
import RenderBlockLineItem from "./LineItems/RenderBlockLineItem";
import NoPermission from "src/components/NoPermission";
import "./style.scss";

function TabInfo(props) {
  const { moduleInfo, recordId, fetchDataRecord, getDataRecord } = props;

  const blocks = moduleInfo?.blocks || [];
  const blocksFilter = blocks?.filter((item) => item?.display_status === "1" && item?.value !== "LBL_ITEM_DETAILS");
  const blockLineItem = blocks?.find((item) => item?.value === "LBL_ITEM_DETAILS");
  const recordData = getDataRecord()?.record || {};
  const notPermission = recordData?.notpermission || false;

  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);

  console.log("render tab info");

  useEffect(() => {
    if (recordId) {
      fetchDataRecord(recordId).then((res) => {
        setIsLoading(false);
      });
    }
  }, [recordId]);

  const onClickAnchor = (e, link) => {
    e.preventDefault();
  };

  const getFieldInfo = useCallback(
    (fieldName) => {
      const fieldsModule = moduleInfo?.fields || [];
      const fieldInfo = fieldsModule?.find((item) => item?.name === fieldName);
      return fieldInfo;
    },
    [moduleInfo]
  );

  const getBlockItems = () => {
    return (blocksFilter || [])
      .map(({ id, label, fields }, index) => {
        const key = String(index);
        const displayHasShow = ["1", "2"];
        const fieldFilter = fields?.filter(({ displaytype }) => displayHasShow?.includes(displaytype));

        return (
          fieldFilter?.length > 0 && {
            key,
            id: `block-${id}`,
            label: <span id={`blockLabel-${id}`}>{label}</span>,
            children: fieldFilter.length > 0 && (
              <RenderBlockFields
                blockId={id}
                fields={fieldFilter}
                isLoading={isLoading}
                reloadTabInfo={reloadTabInfo}
                getFieldInfo={getFieldInfo}
                {...props}
              />
            ),
            className: "collapse-custom-item",
          }
        );
      })
      .filter(Boolean);
  };

  const getAnchorItems = () => {
    return (blocks || [])
      ?.filter((block) => block?.display_status === "1")
      ?.map((item, index) => {
        const { id, label, fields, value } = item;
        const key = String(index);
        const displayHasShow = ["1", "2"];
        const fieldFilter = fields?.filter(({ displaytype }) => displayHasShow?.includes(displaytype));

        return (
          (fieldFilter?.length > 0 || value === "LBL_ITEM_DETAILS") && {
            key,
            href: "#block-" + id,
            title: label,
          }
        );
      })
      .filter(Boolean);
  };

  const reloadTabInfo = useCallback(async () => {
    const timeNow = new Date().getTime();
    await setReload(timeNow);
  }, []);

  return (
    <div className="tabinfo-app-container">
      {notPermission ? (
        <div className="content-not-permission">
          <NoPermission />
        </div>
      ) : (
        <>
          <div className="collapse-content">
            <Collapse
              items={getBlockItems()}
              expandIcon={({ isActive }) => (
                <FaIcon icon={"fa-chevron-down"} className={`arrow-collapse ${isActive ? "arrow-active" : ""}`} />
              )}
              defaultActiveKey={getBlockItems()?.map((item) => item.key)}
              bordered={false}
              className="collapse-custom"
            />

            {blockLineItem && (
              <RenderBlockLineItem
                isLoading={isLoading}
                reloadTabInfo={reloadTabInfo}
                blockData={blockLineItem}
                getFieldInfo={getFieldInfo}
                reload={reload}
                {...props}
              />
            )}
          </div>
          <div className="anchor-content">
            <Anchor
              targetOffset={300}
              getContainer={() => document.querySelector(".tabs-container")}
              onClick={onClickAnchor}
              items={getAnchorItems()}
              className="anchor-custom"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default memo(TabInfo);
