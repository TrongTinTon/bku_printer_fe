import React, { useRef } from "react";
import { ConfigProvider, Table, Tooltip, Skeleton } from "antd";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import EmptyList from "src/components/EmptyList";
import appGlobal from "../../global/AppGlobal";
import RenderCellWithType from "./RenderCellWithType";
import RenderFilterColumn from "./RenderFilterColumn";
import "./style.scss";

function TableData(props) {
  const { module, isLoading, handleClearSortFilter, handleSubmitFilter, filters } = props;

  const moduleLabel = module && appGlobal.GetModuleLabel(module);

  const searchColumnRef = useRef(null);

  const handleDropdownFilterOpen = (visible, columnInfo) => {
    if (visible) {
      setTimeout(() => {
        searchColumnRef.current?.select();
      }, 100);

      const filterContainers = document.querySelectorAll(".filter-dropdown-container");
      filterContainers.forEach((container) => {
        if (container.id !== columnInfo.column) {
          const closeBtnElement = container.querySelector(".btn-cancel-filter");
          closeBtnElement.click();
        }
      });
    }
  };

  const renderCellHeader = (sortColumns, columnInfo, isFilterColumn, isSorterColumn) => {
    const columnSorted = sortColumns?.find((sort) => sort.column.key === columnInfo?.column);
    const sortOrder = columnSorted?.order || isSorterColumn;
    const checkShowSort = sortOrder || isFilterColumn;
    return (
      <>
        {checkShowSort && (
          <Tooltip title="Xóa lọc & sắp xếp">
            <div className="btn-clear-sort" onClick={(e) => handleClearSortFilter(e, columnInfo?.column)}>
              <FaIcon icon="fa-circle-xmark" />
            </div>
          </Tooltip>
        )}
        <span>{columnInfo?.label}</span>
      </>
    );
  };

  const renderSortOfColumn = ({ sortOrder }) => {
    return (
      <div className="sort-column">
        <FaIcon className={`sort-up ${sortOrder == "ascend" && "active"}`} icon="fa-sort-up" />
        <FaIcon className={`sort-down ${sortOrder == "descend" && "active"}`} icon="fa-sort-down" />
      </div>
    );
  };

  const renderFilterDropdown = (props, columnInfo) => {
    const { visible } = props;
    if (visible) {
      return (
        <RenderFilterColumn
          {...props}
          filters={filters}
          searchColumnRef={searchColumnRef}
          columnInfo={columnInfo}
          handleSubmitFilter={handleSubmitFilter}
        />
      );
    }
    return null;
  };

  const renderFilterIcon = (isFilterColumn) => {
    return <FaIcon icon="fa-magnifying-glass" color={isFilterColumn ? "#2275FF" : "#A0AEC0"} />;
  };

  const renderEmpty = () => <EmptyList width={170} module={moduleLabel} />;

  const renderCellDefault = (text, record, index, columnInfo, renderCell, colummIndex) => {
    const columnType = columnInfo?.type;
    const isNameField = columnInfo?.isNameField;
    const columnWidth = document.querySelector(`.column-cell.${columnInfo?.column}`)?.clientWidth || 150;
    const countChildren = colummIndex === 0 ? record?.children?.length : 0;

    const DefaultCell = (
      <div className="cell-value-expaned">
        <div className="cell-value-info" style={{ maxWidth: 200 }}>
          {isNameField || columnType?.uitype === "4" ? (
            <Tooltip title={text} placement="topLeft" zIndex={2500}>
              <a className="cell-link-value">{text}</a>
            </Tooltip>
          ) : (
            <RenderCellWithType value={text} columnInfo={columnInfo} />
          )}
        </div>
        {countChildren > 0 && (
          <Tooltip title={`${moduleLabel} con: ${countChildren}`} zIndex={2500}>
            <div className="count-child">
              <FaIcon icon="fa-folder-tree" fontSize={12} /> {countChildren}
            </div>
          </Tooltip>
        )}
      </div>
    );

    return isLoading ? (
      <Skeleton.Input
        style={{ width: columnWidth - 35 }}
        className="cell-skeleton"
        active={true}
        size={"small"}
        block={true}
      />
    ) : renderCell ? (
      renderCell({ text, record, index, columnInfo, DefaultCell })
    ) : (
      DefaultCell
    );
  };

  const listDataSkeleton = () => {
    const listSkeleton = [];
    for (let i = 0; i < 20; i++) {
      listSkeleton.push({
        key: i + 1,
        columns: props?.columns?.map((header, index) => ({
          key: index,
          [header.column]: header.column,
        })),
      });
    }
    return listSkeleton;
  };

  const newColumns = props?.columns?.map((item, index) => {
    const columnInfo = item?.columnInfo;
    const isFilterColumn = item?.isFilterColumn;
    const isSorterColumn = item?.isSorterColumn;
    const renderCell = item?.renderCell;
    const hasImgField = columnInfo?.hasImgField;
    const colummIndex = index;

    const classFixed =
      index === 0 && props.dataSource?.length > 0
        ? hasImgField
          ? "fixed-first-column-img"
          : "fixed-first-column"
        : "";

    return {
      ...item,
      className: `column-cell ${classFixed} ${item.key} ${isFilterColumn && "active"}`,
      title: ({ sortColumns }) => renderCellHeader(sortColumns, columnInfo, isFilterColumn, isSorterColumn),
      render: (text, record, index) => renderCellDefault(text, record, index, columnInfo, renderCell, colummIndex),
      sortIcon: renderSortOfColumn,
      filterIcon: () => renderFilterIcon(isFilterColumn),
      filterDropdown: (props) => renderFilterDropdown(props, columnInfo),
      onFilterDropdownOpenChange: (visible) => handleDropdownFilterOpen(visible, columnInfo),
    };
  });

  const newProps = { ...props, dataSource: isLoading ? listDataSkeleton() : props.dataSource, columns: newColumns };

  return (
    <ConfigProvider
      renderEmpty={renderEmpty}
      theme={{
        components: {
          Table: {
            rowHoverBg: "#F3F5F9",
          },
        },
      }}>
      <Table className="listview-table" {...newProps} />
    </ConfigProvider>
  );
}

export default TableData;
