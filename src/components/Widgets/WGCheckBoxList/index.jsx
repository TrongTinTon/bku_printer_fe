import React, { useState, useEffect } from "react";
import WGCheckBoxItem from "./WGCheckBoxItem";
import WGCheckBoxAll from "./WGCheckBoxAll";
import _ from "lodash";
import "./style.scss";

function WGCheckBoxList(props) {
  const [selection, setSelection] = useState({ onChange: false, data: [] });
  const { title, count, icon, color, listData, onListSelection, colorStyle, onSubmit } = props;

  const handleSelectedItem = (selectedItems) => {
    onSubmit && onSubmit(selectedItems);
  };
  useEffect(() => {
    selection.onChange === true && onListSelection && onListSelection({ selectedItems: selection.data });
  }, [selection]);

  return (
    <div className="checkBoxListContainer">
      <div className="checkBoxListContainer_blockTile">
        <div className="checkBoxListContainer_blockTile_left">
          <img src={icon} width="25px" height="25px" />
          <span>{title}</span>
        </div>
        <div className="checkBoxListContainer_blockTile_right">
          <div className={`boxBadge ${colorStyle}-gradient-bg`}>
            <div className="boxBadge_around">
              <div className="boxBadge_around_content">
                <span className="">{props.count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="checkBoxListContainer_body">
        <WGCheckBoxAll
          isChecked={false}
          title={title}
          icon={icon}
          onListSelection={onListSelection}
          colorStyle={colorStyle}
          setSelection={setSelection}
        />
        {listData.length > 0 &&
          listData.map((item, index) => {
            return (
              <div key={index}>
                <WGCheckBoxItem
                  isChecked={
                    selection.data.length > 0 &&
                    selection.data.find((obj) => {
                      return obj.id === item.id;
                    })
                      ? true
                      : false
                  }
                  itemData={item}
                  title={title}
                  icon={icon}
                  onListSelection={onListSelection}
                  colorStyle={colorStyle}
                  setSelection={setSelection}
                />
              </div>
            );
          })}
      </div>
      <div className="checkBoxListContainer_footer">
        <div className="orderContainer">
          <div
            className="box info-gradient-bg white btnOrder"
            onClick={() => handleSelectedItem({ selectedItems: selection.data })}
          >
            <span>Đặt hàng</span>
          </div>
          <div className="box disable selectedItem">
            <span>{`Đã chọn: ${selection.data.length}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WGCheckBoxList;
