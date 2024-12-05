import React from "react";
import { Skeleton } from "antd";

function RenderSkeletonItem() {
  const count = 3;

  const renderSkeItem = () => {
    return (
      <tr className="skeleton-lineitem">
        <td className="ske-img">
          <Skeleton.Image active={true} style={{ height: 115, width: 115 }} block />
        </td>

        <td className="ske-group-name">
          <Skeleton.Input active={true} style={{ minWidth: "100%" }} block />
          <Skeleton.Input active={true} style={{ maxWidth: "60%" }} block />
          <Skeleton.Input active={true} style={{ maxWidth: "80%" }} block />
        </td>

        <td className="ske-group-qty">
          <Skeleton.Input active={true} style={{ minWidth: "100%" }} block />
        </td>

        <td className="ske-group-listprice">
          <Skeleton.Input active={true} style={{ maxWidth: "80%" }} block />
        </td>

        <td className="ske-group-total">
          <Skeleton.Input active={true} style={{ maxWidth: "80%" }} block />
          <Skeleton.Input active={true} style={{ maxWidth: "60%", marginTop: 10 }} block />
        </td>
      </tr>
    );
  };

  return (
    <>
      {Array(count)
        .fill(0)
        .map((item, index) => (
          <React.Fragment key={index}>{renderSkeItem()}</React.Fragment>
        ))}
    </>
  );
}

export default RenderSkeletonItem;
