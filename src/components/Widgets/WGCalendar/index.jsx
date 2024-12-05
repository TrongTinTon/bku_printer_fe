import React, { useState, memo } from "react";
import "./style.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import vilocale from "@fullcalendar/core/locales/vi";
import { WGBoxList } from "src/components/Widgets";

import _ from "lodash";

function WGCalendar(props) {
  const { title, icon, listData, eventClick } = props;
  const colorStyle = {
    1: "success-gradient-bg white",
    2: "danger-gradient-bg white",
  };

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const handleEventClick = ({ el, event, jsEvent, view }) => {
    const eventData = event._def.extendedProps.data;
    eventClick && eventClick({ el, event, jsEvent, view, props });
  };

  const renderEventContent = (eventInfo) => {
    var groupId = eventInfo.event._def.groupId;
    var count = _.filter(listData, function (item) {
      return item.ngay_bat_dau == groupId;
    }).length;
    return count == 1 ? (
      <div className="textEvent">
        <span>{eventInfo.event.title}</span>
      </div>
    ) : (
      <div className="pointEvent">
        <div
          className={
            colorStyle[eventInfo.event._def.extendedProps.data.trang_thai]
          }
        >
          <span className="pointText">{eventInfo.event.title}</span>
        </div>
      </div>
    );
  };

  const moreLinkHandle = ({ num, view }) => {
    const data = view.getCurrentData();
    return <span>{`+ ${num}`}</span>;
  };

  return (
    <div className="calendarContainer">
      <div className="calendarContainer_blockTile">
        <div className="calendarContainer_blockTile_left">
          <img src={icon} width="25px" height="25px" />
          <span>{title}</span>
        </div>
        <div className="calendarContainer_blockTile_right">
          <span className="btnAll info">Tất cả</span>
        </div>
      </div>
      <div className="calendarContainer_body">
        <FullCalendar

          height={390}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,title,next,today",
            right: "timeGridDay,dayGridMonth",
          }}
          locale={vilocale}
          initialView="dayGridMonth"
          events={listData.map((event, index) => {
            return {
              groupId: event.ngay_bat_dau,
              id: event.id,
              title: event.subject,
              date: event.ngay_bat_dau,
              start: event.thoi_gian_bat_dau,
              end: event.thoi_gian_ket_thuc,
              classNames: colorStyle[event.trang_thai],
              data: event,
            };
          })}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          allDaySlot={false}
          dayMaxEvents={2}
          moreLinkContent={moreLinkHandle}
        />
        <div className="realtimeEventShowing">
          <WGBoxList
            isShowMultiowner={true}
            title="Đang diễn ra"
            count={_.filter(listData, { trang_thai: "1" }).length}
            colorStyle="disable"
            listData={_.filter(listData, { trang_thai: "1" })}
          />
        </div>
      </div>
    </div>
  );
}

export default WGCalendar;