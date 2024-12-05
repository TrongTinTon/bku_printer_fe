/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListModule } from "src/store/module/actions";
import { setListviewConfig, updateListviewCount } from "src/store/module/reducers";
import Input from "src/components/Form/Input";
import ServerUrl from "src/constants/ServerUrl";
import { Button, Image } from "antd";
import Pagination from "src/components/Pagination";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import TableData from "src/components/TableData";
import appGlobal from "src/global/AppGlobal";

function RenderTable(props) {
  const dispatch = useDispatch();

  const { module, renderCell, tabkey, renderColumn, handleSetUrl, onPressCell, getDataCustom } = props;
  const moduleName = module.name;

  const moduleLists = useSelector((state) => state.module.moduleLists);
  const listConfig = useSelector((state) => state.module.listviewConfig[moduleName]);

  const sorter = listConfig?.[tabkey]?.sorter;
  const page = listConfig?.[tabkey]?.page;
  const searchtext = listConfig?.[tabkey]?.searchtext || "";
  const filters = listConfig?.[tabkey]?.filters;

  const moduleInfo = moduleLists.find((item) => item.name === moduleName);
  const moduleFields = moduleInfo?.fields;
  const moduleListview = moduleInfo?.listviews;
  const modulePermission = moduleInfo?.permission;
  const headerColumn = moduleListview.find((item) => item.cvid === tabkey)?.headers || [];
  const hasImgField = moduleFields?.some((field) => field.column === "imagename");

  const contentBodyRef = useRef(null);
  const listData = useRef([{ key: null }]);
  const totalCount = useRef(0);
  const totalParent = useRef(null);
  const isScrollHorizontal = useRef(false);

  const [isLoading, setLoading] = useState(true);
  const [isReloadTable, setReloadTable] = useState(false);

  console.log("re-render-table");

  // Fetch data
  const fetchData = async (currentPage, currentOrderby, currentSearchtext, currentFilter) => {
    const valueSort = currentOrderby?.order === "ascend" ? "ASC" : "DESC";
    const orderby = currentOrderby?.column ? { name: currentOrderby.columnKey, value: valueSort } : "";
    const action = getDataCustom ? getDataCustom : getListModule;
    const datas = await dispatch(
      action({
        module: moduleName,
        cvid: tabkey,
        page: currentPage,
        searchtext: currentSearchtext,
        filters: currentFilter?.length > 0 ? currentFilter : "",
        orderby,
      })
    );

    if (datas && datas?.records) {
      handleAddChild(datas.records);

      listData.current = datas.records;
      totalCount.current = datas.totalCount;
      totalParent.current = datas.totalParent;

      if (contentBodyRef.current) {
        // Scroll to top
        contentBodyRef.current.scrollTop = 0;
      }
      const currentTotalCount = document.querySelector(`#count-tab-value-${tabkey}`)?.innerHTML * 1;
      if (currentTotalCount >= 0 && currentTotalCount !== datas.totalCount) {
        dispatch(updateListviewCount({ moduleName, cvid: tabkey, totalCount: datas.totalCount }));
      }
      setLoading(false);
      handleUpdateNumAndWidthRow();
    } else {
      listData.current = [];
      totalCount.current = 0;
      totalParent.current = null;
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSetUrl(tabkey, page || 1, null);
    fetchData(page, sorter, searchtext, filters);
  }, [page, sorter, filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentBodyRef.current && !isLoading && listData.current.length !== 0) {
        const currentScrollPosition = contentBodyRef.current.scrollLeft;
        const contentBodyWidth = document.querySelector(`#listview-table table`)?.clientWidth;
        const updatedPosition = { moduleName, tabkey, scrollPosition: currentScrollPosition, contentBodyWidth };
        let scrollPositions = JSON.parse(localStorage.getItem("scrollListPosition")) || [];
        const existingIndex = scrollPositions.findIndex(
          (position) => position.moduleName === updatedPosition.moduleName && position.tabkey === updatedPosition.tabkey
        );
        existingIndex !== -1
          ? (scrollPositions[existingIndex] = updatedPosition)
          : scrollPositions.push(updatedPosition);
        localStorage.setItem("scrollListPosition", JSON.stringify(scrollPositions));
      }
    };

    if (contentBodyRef.current && listData.current.length === 0) {
      contentBodyRef.current.scrollLeft =
        contentBodyRef.current?.scrollWidth / 2 - contentBodyRef.current?.clientWidth / 2;
    } else {
      handleUpdateScrollPosition();
    }
    !isLoading && contentBodyRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      contentBodyRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  // handle scroll horizontal table
  useEffect(() => {
    const table = document.querySelector(".listview-content");
    const contentBody = table.querySelector(".content-body");
    const tableBody = table.querySelector(".ant-table-tbody");

    const handleMouseMove = (e) => {
      const isDown = e.buttons === 1;
      const isUp = e.buttons === 0;
      const isCtrl = e.altKey || e.metaKey || e.ctrlKey;

      if (isCtrl && isDown) {
        contentBody.scrollLeft -= e.movementX;
        isScrollHorizontal ? (isScrollHorizontal.current = true) : null;
        tableBody.style.cursor = "grabbing";
        e.preventDefault();
      }

      if (isUp) {
        tableBody.style.cursor = "default";
        setTimeout(() => {
          isScrollHorizontal ? (isScrollHorizontal.current = false) : null;
        }, 100);
      }
    };

    tableBody.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleMouseMove);

    return () => {
      tableBody.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleMouseMove);
    };
  }, []);

  const handleAddChild = (listRecord) => {
    if (!Array.isArray(listRecord) || listRecord.length === 0) {
      return;
    }

    listRecord.forEach((record) => {
      const childrens = record?.childrens?.records;
      if (Array.isArray(childrens) && childrens.length > 0) {
        record.children = childrens;
        handleAddChild(childrens);
      }
    });
  };

  // Handle action
  const handleSearch = (value, event) => {
    const trimValue = value.trim();

    if (!trimValue && trimValue === searchtext) return;

    const config = page !== 1 ? { page: 1, searchtext: trimValue } : { searchtext: trimValue };
    dispatch(setListviewConfig({ moduleName, tabkey, listConfig: config }));
    setLoading(true);
    page === 1 && fetchData(1, sorter, trimValue, filters);
  };

  const handleNextPage = (page, pageSize) => {
    dispatch(setListviewConfig({ moduleName, tabkey, listConfig: { page: page } }));
    setLoading(true);
  };

  const handleSelectRow = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys);
  };

  const handleExpanedRow = () => {
    handleUpdateNumAndWidthRow();
  };

  const handlePessCell = ({ record, columnInfo }) => {
    if (isScrollHorizontal.current || isLoading) return;
    const recordId = record.key;
    handleSetUrl(null, null, recordId);
    if (onPressCell) onPressCell({ record, columnInfo, modulePermission });
  };

  const handlePressStar = (record, e) => {
    const elementStar = e.currentTarget;
    elementStar.classList.toggle("active");
  };

  const handleClearSortFilter = (e, column) => {
    e.stopPropagation();
    const newFilters = filters?.filter((filter) => filter.name !== column);
    const isRemoveSorter = sorter?.columnKey === column;
    const config = isRemoveSorter ? { sorter: {}, filters: newFilters } : { filters: newFilters };
    dispatch(setListviewConfig({ moduleName, tabkey, listConfig: config }));
    setLoading(true);

    document
      .querySelectorAll(`#${column}.filter-dropdown-container .btn-reset-filter`)
      .forEach((closeResetElement) => closeResetElement.click());
  };

  const handleChangeTable = (pagination, filters, sorter) => {
    const config = { sorter: sorter };
    dispatch(setListviewConfig({ moduleName, tabkey, listConfig: config }));
    setLoading(true);
  };

  const handleSubmitFilter = (values, isRemove) => {
    let updatedFilters = filters || [];
    if (isRemove) {
      updatedFilters = updatedFilters.filter((filter) => filter.name !== values.name);
    } else {
      const existingFilterIndex = updatedFilters.findIndex((filter) => filter.name === values.name);
      existingFilterIndex !== -1 ? (updatedFilters[existingFilterIndex] = values) : updatedFilters.push(values);
    }

    const config = page !== 1 ? { page: 1, filters: updatedFilters } : { filters: updatedFilters };

    dispatch(setListviewConfig({ moduleName, tabkey, listConfig: config }));
    setLoading(true);
    page === 1 && fetchData(1, sorter, searchtext, updatedFilters);
  };

  const handleUpdateScrollPosition = () => {
    const scrollPositions = JSON.parse(localStorage.getItem("scrollListPosition")) || [];
    const currentScrollPosition = scrollPositions.find(
      (position) => position.moduleName === moduleName && position.tabkey === tabkey
    );
    const currentBodyWidth = document.querySelector(`#listview-table table`)?.clientWidth;
    const previousBodyWidth = currentScrollPosition?.contentBodyWidth || currentBodyWidth;

    const widthDifference = currentBodyWidth - previousBodyWidth;
    const adjustedScrollPosition = currentScrollPosition?.scrollPosition + widthDifference;

    if (currentScrollPosition) {
      contentBodyRef.current.scrollLeft = adjustedScrollPosition;
    }
  };

  const handleUpdateNumAndWidthRow = () => {
    requestAnimationFrame(() => {
      const numRowElements = document.querySelectorAll(".num-row");
      numRowElements.forEach((numRowElement, index) => {
        numRowElement.textContent = (index + 1).toString().padStart(2, "0");
      });
    });
    requestAnimationFrame(() => {
      const rowExpandElements = document.querySelectorAll(".ant-table-cell-with-append");
      rowExpandElements.forEach((rowExpandElement, index) => {
        const indentLevelClass = rowExpandElement.querySelector(".ant-table-row-indent")?.classList[1];
        const indentLevel = indentLevelClass?.split("-")[2] || 0;
        const cellValue = rowExpandElement.querySelector(".cell-value-expaned");
        const cellValueWidth = cellValue?.offsetWidth + 100 || 0;
        rowExpandElement.style.minWidth = `${cellValueWidth + indentLevel * 15}px`;
      });
    });
  };

  const onReloadTable = async () => {
    await fetchData(page, sorter, searchtext, filters);
    setReloadTable(!isReloadTable);
  };

  // Render
  const renderActionCell = (checked, record, index, originNode) => {
    const imgField = record?.imagename;
    const imgSrc =
      imgField && imgField.length > 0 ? `https://quocduygroup.com/vtiger/${record.imagename[0]?.imgUrl}` : "";
    const numRow = [index + 1].toString().padStart(2, "0");
    const starred = record.starred === "1";

    return (
      <div className="column-action">
        {originNode}
        {record.key ? (
          <div className="row-action">
            <span className={`btn-star ${starred && "active"}`} onClick={(e) => handlePressStar(record, e)}>
              <FaIcon className="star-nonactive" icon="fa-regular fa-star" fontSize={20} />
              <img className="star-active" src={`${ServerUrl.urlSub}assets/icon/StarSolid.svg`} />
            </span>
            <span className="num-row">{numRow}</span>
            {imgSrc ? (
              <div className="avartar-container">
                <Image
                  src={imgSrc}
                  preview={{
                    mask: <FaIcon icon="fa-eye" />,
                  }}
                  className="avatar"
                />
              </div>
            ) : (
              hasImgField && <div className="avatar-empty" />
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const renderItemPagination = (_, type, originalElement) => {
    if (type === "prev") {
      return <FaIcon fontSize={16} icon="fa-angle-left" />;
    }
    if (type === "next") {
      return <FaIcon fontSize={16} icon="fa-angle-right" />;
    }
    return originalElement;
  };

  // Render column
  const listColumns =
    headerColumn
      ?.map((header, index) => {
        const columnInfo = appGlobal.GetFieldInfo(header.module, header.column);
        const isFilterColumn = filters?.find((filter) => filter.name === header.columnData);
        const isSorterColumn = sorter?.columnKey === columnInfo?.columnData && sorter?.order;

        return columnInfo
          ? {
              dataIndex: header.columnData,
              key: header.columnData,
              ellipsis: true,
              columnInfo: columnInfo,
              isFilterColumn: isFilterColumn,
              isSorterColumn: isSorterColumn,
              renderCell: renderCell,
              sorter: true,
              fixed: index === 0 && listData.current.length > 0 ? "left" : false,
              sortOrder: sorter?.columnKey === header.columnData ? sorter.order : null,
              onCell: (record, rowIndex) => {
                return { onClick: (event) => handlePessCell({ record, columnInfo }) };
              },
            }
          : null;
      })
      .filter(Boolean) || [];

  const columns = renderColumn ? renderColumn(listColumns) : listColumns;

  return (
    <div className="listview-content">
      <div className="content-header">
        <div className="group-left">
          {/* Thêm className active */}
          <Button className="btn-filter">
            <FaIcon icon="fa-filter" /> Lọc
            <div className="dot-active" />
          </Button>
          <Input
            className="input-search"
            allowClear
            type="search"
            size="large"
            placeholder="Tìm kiếm"
            defaultValue={searchtext}
            onSearch={handleSearch}
          />
        </div>
        <div className="group-left">
          <Pagination
            simple
            current={page || 1}
            defaultCurrent={1}
            defaultPageSize={20}
            total={totalParent.current || totalCount.current || 20}
            showTotal={(total, range) => (totalParent.current || isLoading ? "" : `${range[0]} đến ${range[1]}`)}
            itemRender={renderItemPagination}
            showTitle={false}
            onChange={!isLoading ? handleNextPage : () => {}}
          />
        </div>
      </div>

      <div ref={contentBodyRef} className="content-body">
        <TableData
          id="listview-table"
          columns={columns}
          dataSource={listData.current}
          rowSelection={{
            onChange: handleSelectRow,
            renderCell: renderActionCell,
            columnWidth: 40,
            fixed: true,
            checkStrictly: true,
          }}
          expandable={{
            indentSize: 15,
            onExpandedRowsChange: handleExpanedRow,
          }}
          onChange={handleChangeTable}
          pagination={false}
          showSorterTooltip={false}
          tableLayout="auto"
          handleClearSortFilter={handleClearSortFilter}
          handleSubmitFilter={handleSubmitFilter}
          isLoading={isLoading}
          module={module.name}
          filters={filters}
          isScrollHorizontal={isScrollHorizontal}
        />
        <div id="btnReloadListTable" style={{ display: "none" }} onClick={onReloadTable} />
      </div>
    </div>
  );
}

export default memo(RenderTable);
