import React, { useState, memo } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import Input from "src/components/Form/Input";
import { Dropdown } from "antd";
import FilterModule from "src/components/FilterModule";

function KanbanBoardHeader(props) {
  const { containers, items, listItems, onNewTask, renderTabs, isLoading, fetchItems, TaskInfo } = props;

  const totalParent = listItems?.current?.totalParent || 0;
  const permissionTask = TaskInfo?.permission;
  const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
  const sortContent = configDetailView?.["Project"]?.kanban?.orderby;
  const filterContent = configDetailView?.["Project"]?.filters;

  const configDropDown = (type) => {
    return {
      trigger: ["click"],
      placement: "bottomLeft",
      arrow: true,
      overlayClassName: type === "sort" ? "kanban-sort-dropdown" : "kanban-filter-dropdown",
      destroyPopupOnHide: true,
    };
  };

  // Handle event
  const onReloadList = () => {
    !isLoading && containers.length > 0 && fetchItems({ loading: true });
  };

  const handleSearch = (value, event, { source }) => {
    if (isLoading || containers.length === 0) return;

    if (source === "clear" || value || (value === "" && totalParent > 0 && items.length === 0)) {
      fetchItems({ searchtext: value, loading: true });
    }
  };

  const onCloseDropdown = () => {
    const kanbanHeader = document.querySelector(".kanban-header");
    kanbanHeader?.click();
  };

  const handleFilter = (filters) => {
    const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
    configDetailView["Project"] = { ...configDetailView["Project"], filters: filters };
    localStorage.setItem("configDetailView", JSON.stringify(configDetailView));

    const orderby = configDetailView?.["Project"]?.kanban?.orderby;

    fetchItems({ filters: filters, orderby: orderby, loading: true });
  };

  // Render
  const renderSortDropDown = () => {
    return <RenderSortDropdown fetchItems={fetchItems} />;
  };

  const renderFilterDropDown = () => {
    const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
    const initValueFilter = configDetailView?.["Project"]?.filters || [];
    return (
      <FilterModule
        moduleInfo={TaskInfo}
        onCloseDropdown={onCloseDropdown}
        initValueFilter={initValueFilter}
        onSubmit={handleFilter}
      />
    );
  };

  return (
    <div className="kanban-header">
      <div className="group-left">
        <Dropdown {...configDropDown("filter")} dropdownRender={renderFilterDropDown}>
          <div className="btn-filter">
            <FaIcon icon="fa-filter" />
            <span>Lọc</span>
            {filterContent?.length > 0 && <div className="sort-bage-active" />}
          </div>
        </Dropdown>
        <Dropdown {...configDropDown("sort")} dropdownRender={renderSortDropDown}>
          <div className="btn-sort">
            <FaIcon icon="fa-arrow-up-wide-short" />
            <span>Sắp xếp</span>
            {sortContent && <div className="sort-bage-active" />}
          </div>
        </Dropdown>
        <div className="search">
          <Input
            onSearch={handleSearch}
            className="input-search"
            allowClear
            type="search"
            size="large"
            placeholder="Tìm kiếm công việc"
          />
        </div>
      </div>

      <div className="group-right">
        {permissionTask?.createable && (
          <div id="btnAddTask" className="btn-reload" onClick={() => onNewTask(containers[0])}>
            <FaIcon icon="fa-plus" />
            <span>Thêm việc</span>
          </div>
        )}
        <div className={`btn-reload ${isLoading && "disabled"}`} onClick={onReloadList}>
          <FaIcon icon="fa-arrow-rotate-right" />
        </div>

        <div className="btn-total">
          <span>Tổng: {totalParent}</span>
        </div>
        {renderTabs()}
      </div>
    </div>
  );
}

const RenderSortDropdown = memo(({ fetchItems }) => {
  const sortOptions = [
    { fieldName: "", sort: "", text: "Không sắp xếp" },
    { fieldName: "createdtime", sort: "ASC", text: "Ngày tạo (Mới nhất)" },
    { fieldName: "createdtime", sort: "DESC", text: "Ngày tạo (Cũ nhất)" },
    { fieldName: "cf_task_status", sort: "ASC", text: "Trạng thái (Tăng dần)" },
    { fieldName: "cf_task_status", sort: "DESC", text: "Trạng thái (Giảm dần)" },
    { fieldName: "cf_deadline_date", sort: "ASC", text: "Hạn hoàn thành (Tăng dần)" },
    { fieldName: "cf_deadline_date", sort: "DESC", text: "Hạn hoàn thành (Giảm dần)" },
  ];

  const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
  const sortContent = configDetailView?.["Project"]?.kanban?.orderby;
  const filterContent = configDetailView?.["Project"]?.filters;

  const updateConfigDetailView = (sortContent) => {
    const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
    configDetailView["Project"] = { ...configDetailView["Project"], kanban: { orderby: sortContent } };
    localStorage.setItem("configDetailView", JSON.stringify(configDetailView));
  };

  const handleSort = (fieldName, sort) => {
    document.querySelector(".btn-sort")?.click();

    // Check if sort content is the same as the current sort content
    if (sortContent?.name === fieldName && sortContent?.value === sort) return;
    if (fieldName === "" && sortContent === "") return;

    const newSortContent = fieldName ? { name: fieldName, value: sort } : "";
    fetchItems({ orderby: newSortContent, filters: filterContent, loading: true });

    // Update config detail view to local storage
    updateConfigDetailView(newSortContent);
  };

  return (
    <div className="sort-container">
      {sortOptions.map(({ fieldName, sort, text }) => {
        let isActive = sortContent?.name === fieldName && sortContent?.value === sort;
        if (fieldName === "" && sortContent === "") isActive = true;

        return (
          <div
            key={`${fieldName}-${sort}`}
            className={`item-sort ${isActive && "active"}`}
            onClick={() => handleSort(fieldName, sort)}>
            <span>{text}</span>
          </div>
        );
      })}
    </div>
  );
});

export default memo(KanbanBoardHeader);
