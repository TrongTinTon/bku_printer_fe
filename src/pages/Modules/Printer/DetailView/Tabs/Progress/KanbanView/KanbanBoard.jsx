/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { createPortal, unstable_batchedUpdates } from "react-dom";
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  DndContext,
  DragOverlay,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensors,
  useSensor,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { coordinateGetter } from "./multipleContainersKeyboardCoordinates";
import { List, AutoSizer } from "react-virtualized";
import { Item } from "./Item";
import { Container } from "./Container";
import { App as AntdApp, Button } from "antd";
import {
  getRelatedListModule,
  getListTask,
  saveTaskInProjectTask,
  saveProjectTaskInProject,
  saveRecord,
  deleteRecords,
} from "src/store/module/actions";
import { useDispatch, useSelector } from "react-redux";
import DetailTask from "./Item/DetailTask";
import "./style.scss";
import KanbanBoardHeader from "./KanbanBoardHeader";
import KanbanBoardSkeleton from "./KanbanBoardSkeleton";
import AddColumn from "./Container/AddColumn";

export function KanbanBoard(props) {
  const dispatch = useDispatch();
  const { message, notification } = AntdApp.useApp();

  const { module, recordId, getDataRecord, userInfo, ProjectTaskInfo, TaskInfo } = props;

  const [items, setItems] = useState({});
  const [containers, setContainers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);

  const clonedItems = useRef(null);
  const lastOverId = useRef(null);
  const lastActiveId = useRef(null);
  const listVirtualRef = useRef(null);
  const recentlyMovedToNewContainer = useRef(false);
  const heightItemActive = useRef(null);
  const isSortingContainer = activeId ? containers?.some((col) => col?.key === activeId) : false;
  const containersIds = useMemo(() => containers?.map((col) => col?.key), [containers]);
  const taskItemId = useRef(null);
  const listItems = useRef([]); // Danh sách task chưa filter
  const dataProjectKanban = useRef(null); // Lấy data project và project-task đưa vào task detail
  const fieldsTaskChange = useRef([]);
  const recordData = getDataRecord()?.record;
  const isUserAdmin = userInfo?.is_admin === "on";
  const isOwnerProject = recordData?.assigned_user_id?.value?.value === userInfo?.id;
  const isScrollHorizontal = useRef(false);
  const perProjectTask = ProjectTaskInfo?.permission;
  const configDetailView = JSON.parse(localStorage.getItem("configDetailView")) || {};
  const positionLocal = configDetailView?.[module?.name]?.kanbanScroll;

  useEffect(() => {
    recordId ? fetchContainers() : null;
    handleUpdatePositionScroll(null, null, true);
  }, [recordId]);

  useEffect(() => {
    recentlyMovedToNewContainer.current === true &&
      requestAnimationFrame(() => {
        recentlyMovedToNewContainer.current = false;
      });

    // Update position of container
    if (listVirtualRef) {
      Object.keys(listVirtualRef).forEach((key) => {
        const containerId = key.split("list-")[1];
        const position = positionLocal?.[containerId];
        position && listVirtualRef?.[key].scrollToPosition(position);
      });
    }
  }, [items]);

  useEffect(() => {
    if (!activeId && !isLoading && lastActiveId.current) {
      handleFindUpdateData();
      lastActiveId.current = null;
    }
  }, [activeId]);

  // Scroll horizontal on mouse down
  useEffect(() => {
    const kanbanBody = document.querySelector(".kanban-body");

    const removeListener = () => {
      kanbanBody.removeEventListener("mousemove", handleMouseMove);
      kanbanBody.removeEventListener("mouseleave", handleMouseLeave);
      setTimeout(() => {
        isScrollHorizontal.current = false;
      }, 50);
    };

    const handleMouseMove = (e) => ((kanbanBody.scrollLeft -= e.movementX), (isScrollHorizontal.current = true));

    const handleMouseDown = (e) => {
      if (e.button !== 0 || e.target.closest(".header-container")) return;
      kanbanBody.addEventListener("mousemove", handleMouseMove);
      kanbanBody.addEventListener("mouseleave", handleMouseLeave);
    };

    const handleMouseUp = () => removeListener();

    const handleMouseLeave = () => removeListener();

    kanbanBody.addEventListener("mousedown", handleMouseDown);
    kanbanBody.addEventListener("mouseup", handleMouseUp);

    return () => {
      kanbanBody.removeEventListener("mousedown", handleMouseDown);
      kanbanBody.removeEventListener("mouseup", handleMouseUp);
      isScrollHorizontal.current = false;
    };
  }, []);

  // Fetch ProjectTask
  const fetchContainers = async () => {
    const body = {
      module: "ProjectTask",
      cvid: 48,
      page: 1,
      searchtext: "",
      filters: "",
      orderby: { name: "cf_sortorder", value: "ASC" },
      parentModule: module?.name,
      parentId: recordId,
    };
    const result = await dispatch(getRelatedListModule(body));
    if (result) {
      const records = result.records;

      fetchItems({ columns: records });
    }
  };

  // Fetch Task
  const fetchItems = async ({ columns, searchtext = "", filters = "", orderby = "", loading = false }) => {
    let allRecords = [];
    let currentPage = 1;

    const orderbyLocal = orderby || configDetailView?.[module?.name]?.kanban?.orderby; // Lấy sort order từ config
    const filtersLocal = filters || configDetailView?.[module?.name]?.filters; // Lấy filter từ config

    if (loading) {
      setIsLoading(true);
    }

    const fetchPageData = async (page) => {
      const body = {
        module: "Task",
        cvid: 250,
        page: page,
        searchtext: searchtext,
        filters: filtersLocal,
        orderby: orderbyLocal,
        limit: 50,
        projectId: recordId,
        projectTask: columns?.map((col) => col?.key),
      };
      return await dispatch(getListTask(body));
    };

    // Lấy dữ liệu trang đầu tiên
    let initialResult = await fetchPageData(currentPage);
    if (initialResult && initialResult.records.length > 0) {
      allRecords = allRecords.concat(initialResult.records);
      const totalPages = initialResult.totalPage;

      // Lặp qua các trang còn lại
      for (currentPage = 2; currentPage <= totalPages; currentPage++) {
        let result = await fetchPageData(currentPage);
        if (result && result.records.length > 0) {
          allRecords = allRecords.concat(result.records);
        } else {
          break; // Dừng vòng lặp nếu không có dữ liệu
        }
      }
    }

    // add height item to allRecords
    allRecords = allRecords.map((item) => {
      const heightItem = getItemHeight(item);
      return { ...item, heightItem };
    });

    const listColumns = columns || containers;
    listItems.current = initialResult;
    listItems.current.records = allRecords;

    const newItems = listColumns.reduce((acc, col) => {
      const items = allRecords.filter((record) => record?.projecttask_id?.value === col?.key).map((record) => record);
      const sortItems = orderby
        ? items
        : items.sort((a, b) => a?.cf_projecttask_sortorder - b?.cf_projecttask_sortorder);
      acc[col?.key] = sortItems;

      return acc;
    }, {});

    columns && (await setContainers(columns || containers));
    await setItems(newItems);
    setIsLoading(false);
  };

  // Update sort item
  const updateSortItem = async (values) => {
    const body = {
      values: values,
    };
    const result = await dispatch(saveTaskInProjectTask(body));
    if (result) {
      message.success("Cập nhật thành công", [1]);
    } else {
      message.error("Cập nhật thất bại", [2]);
    }
  };

  // Update sort container
  const updateSortContainer = async (values) => {
    const body = {
      values: values,
    };
    const result = await dispatch(saveProjectTaskInProject(body));
    if (result) {
      message.success("Cập nhật thành công", [1]);
    } else {
      message.error("Cập nhật thất bại", [2]);
    }
  };

  // Add, Update column data
  const updateColumnData = async (action, values) => {
    const isCreated = action === "created";
    const info = {
      module: "ProjectTask",
      record: values?.recordId || "",
      values: {
        ...values?.value,
        assigned_user_id: userInfo?.id,
        projectid: { module: module?.name, value: recordId },
      },
    };

    const resultProjectTask = await dispatch(saveRecord(info));

    if (resultProjectTask) {
      const dataRecord = resultProjectTask?.record;
      const key = dataRecord?.key?.value;

      const dataRecordConvert = Object.keys(dataRecord).reduce((acc, key) => {
        acc[key] = dataRecord[key].value;
        return acc;
      }, {});

      if (isCreated) {
        const newContainer = dataRecordConvert;
        unstable_batchedUpdates(() => {
          setContainers([...containers, newContainer]);
          setItems({ ...items, [key]: [] });
        });
      } else {
        unstable_batchedUpdates(() => {
          setContainers(containers.map((col) => (col?.key === key ? { ...col, dataRecordConvert } : col)));
        });
      }

      message.success(isCreated ? "Thêm thành công" : "Cập nhật thành công", [1]);
      return key;
    } else {
      message.error(isCreated ? "Thêm thất bại" : "Cập nhật thất bại", [2]);
      return null;
    }
  };

  // Remove column
  const removeColumn = async (id) => {
    const listItems = items[id];
    const itemIds = listItems?.length > 0 ? listItems?.map((item) => item?.key) : [];
    const body = {
      records: [id, ...itemIds],
    };
    const result = await dispatch(deleteRecords(body));
    if (result) {
      const newContainers = containers.filter((col) => col?.key !== id);
      unstable_batchedUpdates(() => {
        setContainers(newContainers);
      });
      message.success("Xóa thành công", [1]);
    } else {
      message.error("Xóa thất bại", [2]);
    }
  };

  // Update data
  const handleFindUpdateData = () => {
    const id = lastActiveId.current;
    const isContainer = id in items;
    const updateList = (elements, key, callback) => elements.map((el, index) => callback(el, index, key === el?.key));

    // Sort container
    const processContainer = async () => {
      const oldIndex = clonedItems.current?.findIndex((col) => col?.key === id);
      const newIndex = containers.findIndex((col) => col?.key === id);
      if (oldIndex !== newIndex) {
        const resData = updateList(containers, id, (col, index) => ({ key: col?.key, sort: index + 1 }));
        await updateSortContainer(resData);
        return;
      }
    };

    // Sort item
    const processItem = async () => {
      const findContainer = (elements) =>
        Object.keys(elements).find((columnId) => elements[columnId].some((t) => t?.key === id));

      const oldContainer = findContainer(clonedItems.current);
      const newContainer = findContainer(items);

      // If one of containers
      if (oldContainer === newContainer) {
        const oldIndex = clonedItems.current[oldContainer].findIndex((item) => item?.key === id);
        const newIndex = items[newContainer].findIndex((item) => item?.key === id);
        if (oldIndex !== newIndex) {
          const resData = updateList(items[newContainer], id, (item, index) => ({ key: item?.key, sort: index + 1 }));
          await updateSortItem(resData);
          return;
        }
      } else {
        // If move to new container
        const updatedOldList = updateList(items[oldContainer], id, (item, index) => ({
          key: item?.key,
          sort: index + 1,
        }));
        const updatedNewList = updateList(items[newContainer], id, (item, index) => ({
          key: item?.key,
          sort: index + 1,
          ...(item?.key === id && { projecttask_id: { value: newContainer, module: "ProjectTask" } }),
        }));
        const resData = [...updatedOldList, ...updatedNewList];
        await updateSortItem(resData);
        return;
      }
    };

    isContainer ? processContainer() : processItem();
  };

  // Get item height
  const getItemHeight = (item) => {
    const padding = 30 + 15;
    const headerHeight = 21 + 15;
    const labelHeight = 15 + 15;
    const descriptionHeight = item?.description ? 14 + 15 : 0;
    const imgHeight = item?.files ? 156 + 15 : 0;
    const ownerHeight = 30 + 15;
    const infoHeight = 14;
    const returnHeight =
      padding + headerHeight + labelHeight + descriptionHeight + imgHeight + ownerHeight + infoHeight;

    return returnHeight;
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => container.id in items),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && containerItems.some((item) => item?.key === container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 40,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 40,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const findContainer = (id) => {
    if (id in items) {
      return id;
    }
    const containerId = Object.keys(items).find((columnId) => items[columnId].find((item) => item?.key === id));
    return containerId;
  };

  const handleUpdatePositionScroll = (containerId, position, reset) => {
    const config = JSON.parse(localStorage.getItem("configDetailView")) || {};
    const configModule = config[module?.name] || {};
    const kanbanScroll = configModule?.kanbanScroll || {};

    containers.forEach((col) => {
      const id = col?.key;
      if (id === containerId) {
        kanbanScroll[id] = position || 0;
      }
    });

    if (reset) {
      Object.keys(kanbanScroll).forEach((key) => {
        kanbanScroll[key] = 0;
      });
    }

    // update localStorage
    localStorage.setItem(
      "configDetailView",
      JSON.stringify({ ...config, [module?.name]: { ...configModule, kanbanScroll } })
    );
  };

  // Actions
  const onDragStart = ({ active }) => {
    const activeType = active.id in items ? "container" : "item";
    if (activeType === "item") {
      const heightItem = document.getElementById(`kanban-item-${active.id}`)?.offsetHeight;
      heightItemActive.current = heightItem;
    } else {
      const heightContainer = document.getElementById(`kanban-container-${active.id}`)?.offsetHeight;
      heightItemActive.current = heightContainer;
    }
    setActiveId(active.id);
    lastActiveId.current = active.id;
    clonedItems.current = activeType === "item" ? items : containers;
  };

  const onDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      const isDisabled = active.data.current?.disabled;

      if (!isDisabled) {
        // listen mouse move speed
        const mouseMoveSpeed = (e) => {
          const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
          if (speed < 80) {
            setItems((items) => {
              const activeItems = items[activeContainer];
              const overItems = items[overContainer];
              const overIndex = overItems.findIndex((t) => t?.key === overId);
              const activeIndex = activeItems.findIndex((t) => t?.key === active.id);
              let newIndex = overIndex;
              if (!(overId in items)) {
                const isBelowOverItem =
                  over &&
                  active.rect.current.translated &&
                  active.rect.current.translated.top > over.rect.top + over.rect.height;
                newIndex = isBelowOverItem ? overIndex + 1 : overIndex >= 0 ? overIndex : overItems.length;
              }
              recentlyMovedToNewContainer.current = true;
              const newActiveItems = activeItems.filter((item) => item?.key !== active.id);
              const newOverItems = [
                ...overItems.slice(0, newIndex),
                activeItems[activeIndex],
                ...overItems.slice(newIndex),
              ];
              // remove duplicate item key and undefined item in newActiveItems
              const newActiveItemsFilter = newActiveItems.filter(
                (item, index, self) => index === self.findIndex((t) => t?.key === item?.key) && item
              );

              // remove duplicate item key and undefined item in newOverItems
              const newOverItemsFilter = newOverItems.filter(
                (item, index, self) => index === self.findIndex((t) => t?.key === item?.key) && item
              );

              const resturnData = {
                ...items,
                [activeContainer]: newActiveItemsFilter,
                [overContainer]: newOverItemsFilter,
              };

              document.removeEventListener("mousemove", mouseMoveSpeed);

              return resturnData;
            });
          } else {
            document.removeEventListener("mousemove", mouseMoveSpeed);
          }
        };

        document.addEventListener("mousemove", mouseMoveSpeed);
      }
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.findIndex((col) => col?.key === active.id);
        const overIndex = containers.findIndex((col) => col?.key === over.id);
        return arrayMove(containers, activeIndex, overIndex);
      });
      setActiveId(null);
      heightItemActive.current = null;
      return;
    }

    const overId = over?.id;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);
    const disabledActive = active.data.current?.disabled;

    if (!activeContainer || overId == null || (activeContainer !== overContainer && disabledActive)) {
      setActiveId(null);
      heightItemActive.current = null;
      return;
    }

    if (overContainer) {
      const activeIndex = items[activeContainer].findIndex((item) => item?.key === active.id);
      const overIndex = items[overContainer].findIndex((item) => item?.key === overId);
      const overItems = arrayMove(items[overContainer], activeIndex, overIndex);
      const newItems = { ...items, [overContainer]: overItems };

      if (activeIndex !== overIndex) {
        setItems(newItems);
        if (listVirtualRef[`list-${overContainer}`]) {
          listVirtualRef[`list-${overContainer}`].recomputeRowHeights();
          listVirtualRef[`list-${overContainer}`].forceUpdateGrid();
        }
      }
    }

    setActiveId(null);
    heightItemActive.current = null;
  };

  const onDragCancel = () => {
    if (clonedItems.current) {
      setItems(clonedItems.current);
    }

    setActiveId(null);
    clonedItems.current = null;
  };

  const onScrollListItem = (e, containerId) => {
    const position = e?.scrollTop;
    handleUpdatePositionScroll(containerId, position);
  };

  // Open task detail
  const onClickItem = (id) => {
    if (!isScrollHorizontal.current) {
      taskItemId.current = id;
      setOpenTaskDetail(true);
    }
  };

  const onCloseTaskDetail = async () => {
    const setInitValue = () => {
      taskItemId.current = null;
      dataProjectKanban.current = null;
      setOpenTaskDetail(false);
    };

    const isTouchedForm = fieldsTaskChange.current.some((item) => item.touched);

    if (isTouchedForm && !taskItemId.current) {
      const config = (
        <div>
          <Button type="link" onClick={() => notification.destroy()}>
            Ở lại
          </Button>
          <Button
            type="primary"
            onClick={() => {
              notification.destroy();
              fieldsTaskChange.current = [];
              setInitValue();
            }}>
            Đóng
          </Button>
        </div>
      );
      notification.warning({
        message: "Cảnh báo chưa lưu!",
        description: "Thay đổi chưa lưu. Bạn có muốn đóng không??",
        btn: config,
        duration: 0,
        placement: "top",
        closeIcon: <FaIcon icon="fa-xmark" />,
        className: "notification-custom mask",
      });
    } else {
      if (taskItemId.current) {
        const saveBtn = document.getElementById("btnSaveTask");
        await saveBtn?.click();
      }
      setInitValue();
    }
  };

  const onNewTask = (columnInfo) => {
    taskItemId.current = null;
    const countItem = items[columnInfo?.key]?.length || 0;
    dataProjectKanban.current = [
      {
        fieldName: "project_id",
        value: {
          label: recordData?.projectname?.value,
          module: module?.name,
          moduleName: module?.label,
          value: recordId,
        },
      },
      {
        fieldName: "projecttask_id",
        value: {
          label: columnInfo?.label,
          module: "ProjectTask",
          moduleName: "Hạn mục dự án",
          value: columnInfo?.key,
        },
      },
      {
        fieldName: "cf_projecttask_sortorder",
        value: countItem + 1,
      },
    ];

    setOpenTaskDetail(true);
  };

  // Render
  const renderSortableItemDragOverlay = (id) => {
    const data = items[findContainer(id)].find((item) => item?.key === id);
    return data?.key && <Item data={data} dragOverlay disabled={!data?.isEditable} />;
  };

  const renderContainerDragOverlay = (containerId) => {
    const listItems = items[containerId] || [];
    const container = containers.find((col) => col?.key === containerId);
    const disabled = isUserAdmin || isOwnerProject ? false : true;
    return (
      <Container
        data={container}
        items={listItems}
        shadow
        disabled={disabled}
        TaskInfo={TaskInfo}
        heightItemActive={heightItemActive.current}>
        {listItems?.length > 0 && listItems.map((item, index) => <Item key={item?.key} data={item} />)}
      </Container>
    );
  };

  const renderRowItem = (props, listItems) => {
    const { index, key, style, parent } = props;
    const value = listItems[index];
    const isEditable = value?.isEditable;

    return (
      value?.key && (
        <SortableItem
          disabled={!isEditable || isSortingContainer}
          key={value?.key + "-" + index}
          id={value?.key}
          data={value}
          onClick={onClickItem}
          style={style}
        />
      )
    );
  };

  return (
    <div className="kanban-container">
      {/* Kanban header */}
      <KanbanBoardHeader
        {...props}
        containers={containers}
        items={items}
        listItems={listItems}
        onNewTask={onNewTask}
        isLoading={isLoading}
        fetchItems={fetchItems}
      />

      <div className="kanban-body">
        {!isLoading ? (
          <DndContext
            sensors={sensors}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}>
            <div className="list-columns">
              <SortableContext items={[...containersIds]} strategy={horizontalListSortingStrategy}>
                {containers.map((container) => {
                  const containerId = container?.key;
                  const listItems = items[containerId] || [];
                  const listItemsIds = listItems?.map((item) => item?.key);
                  const disabled = isUserAdmin || isOwnerProject ? false : true;
                  const heighListColumn = document.getElementsByClassName("kanban-body")[0]?.offsetHeight || 500;

                  const totalHeightItem = listItems?.reduce((acc, item) => acc + item?.heightItem, 0);

                  return (
                    <div key={containerId}>
                      <DroppableContainer
                        id={containerId}
                        data={container}
                        items={listItems}
                        onNewTask={onNewTask}
                        disabled={disabled}
                        TaskInfo={TaskInfo}
                        updateColumnData={updateColumnData}
                        removeColumn={removeColumn}
                        notification={notification}>
                        {listItems.length > 0 ? (
                          <SortableContext items={listItemsIds} strategy={verticalListSortingStrategy}>
                            <AutoSizer disableHeight>
                              {({ width, height }) => (
                                <List
                                  key={`list-${containerId}-${totalHeightItem}`}
                                  ref={(el) => (listVirtualRef[`list-${containerId}`] = el)}
                                  data={listItems}
                                  rowCount={listItems?.length}
                                  onScroll={(e) => onScrollListItem(e, containerId)}
                                  overscanRowCount={5}
                                  width={width}
                                  height={heighListColumn - 120}
                                  rowHeight={({ index }) => listItems[index]?.heightItem}
                                  rowRenderer={(props) => renderRowItem(props, listItems)}
                                />
                              )}
                            </AutoSizer>
                          </SortableContext>
                        ) : null}
                      </DroppableContainer>
                    </div>
                  );
                })}

                {perProjectTask?.createable && (
                  <AddColumn updateColumnData={updateColumnData} containers={containers} />
                )}
              </SortableContext>
            </div>
            {createPortal(
              <DragOverlay dropAnimation={dropAnimation} zIndex={2000}>
                {activeId
                  ? containers.some((col) => col?.key === activeId)
                    ? renderContainerDragOverlay(activeId)
                    : renderSortableItemDragOverlay(activeId)
                  : null}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        ) : (
          <KanbanBoardSkeleton />
        )}
      </div>

      <DetailTask
        openTaskDetail={openTaskDetail}
        onCloseTaskDetail={onCloseTaskDetail}
        recordId={taskItemId.current}
        module={{ name: "Task" }}
        fetchItems={fetchItems}
        dataProjectKanban={dataProjectKanban.current}
        fieldsTaskChange={fieldsTaskChange}
      />
    </div>
  );
}

const animateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const useMountStatus = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 100);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
};

const DroppableContainer = ({ data, children, disabled, id, items, style, ...props }) => {
  const { active, attributes, isDragging, listeners, over, setNodeRef, transition, transform } = useSortable({
    id,
    data: {
      disabled: disabled,
      type: "container",
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== "container") || items.some((item) => item?.key === over.id)
    : false;

  return (
    <Container
      ref={setNodeRef}
      data={data}
      items={items}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging && !disabled ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...(!disabled && listeners),
      }}
      disabled={disabled}
      {...props}>
      {children}
    </Container>
  );
};

const SortableItem = ({ disabled, id, data, onClick, style }) => {
  const { setNodeRef, setActivatorNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } =
    useSortable({
      id,
      data: {
        disabled: disabled,
      },
    });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={setNodeRef}
      data={data}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      onClick={onClick}
      disabled={disabled}
      styleVir={style}
    />
  );
};
