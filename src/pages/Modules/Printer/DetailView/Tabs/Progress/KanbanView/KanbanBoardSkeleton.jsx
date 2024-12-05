import React from "react";
import { Skeleton } from "antd";

function KanbanBoardSkeleton() {
  const numColumns = 5;
  const renderColumn = (key) => {
    const numItems = 5;
    return (
      <div className="item-skeleton" key={key}>
        <div className="ske-header">
          <Skeleton.Input active={true} block={true} style={{ borderRadius: 10 }} />
        </div>
        <div className="ske-body">
          {Array.from(Array(numItems).keys()).map((item) => {
            const height = Math.floor(Math.random() * 100) + 100;
            return (
              <div className="ske-item" key={item}>
                <Skeleton.Input active={true} block={true} style={{ height: height, borderRadius: 10 }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const renderList = () => {
    return (
      <div className="list-skeleton">
        {Array.from(Array(numColumns).keys()).map((item, index) => {
          return renderColumn(index);
        })}
      </div>
    );
  };
  return <div className="kanban-skeleton-container">{renderList()}</div>;
}

export default KanbanBoardSkeleton;
