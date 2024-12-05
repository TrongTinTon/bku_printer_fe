/* eslint-disable react-refresh/only-export-components */
import React, { useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPrinters } from "src/store/module/actions";
import ServerUrl from "src/constants/ServerUrl";
import { Row, Col, Button } from 'antd';
import "./style.scss";

function ListView(props) {
  const dispatch = useDispatch();
  const [printerlist, setPrinterlist] = useState([]);

  const showPrinters = async () => {
    const response = await dispatch(getPrinters());
    if (response.data) {


      setPrinterlist(response.data)
    }
  }



  useEffect(() => {
    showPrinters()
  }, []);
  return (
    <div className="listview-container">
      <Row className="container" gutter={[16, 16]} align="">
        <Col
          className="content"
          xs={{
            span: 24
          }}

          sm={{
            span: 24
          }}

          lg={{
            span: 24
          }}

        >
          <div className="printer_flow">
            <div className="printer_flow_title">Danh sách máy in</div>
            <div className="printer_flow_body">
              <div className="printer_flow_body_inner">
                <div className="printer_flow_body_inner_header">
                  <div className="page_litmit"></div>
                  <Button
                    icon={<img src={ServerUrl.urlSub + `assets/icon/add_page.svg`} />}
                    className="add-page-btn"
                  >
                    Thêm máy in
                  </Button>
                </div>
                <div className="printer_flow_body_inner_main">
                  <div className="p-printer_list">
                    {printerlist.map((printer, index) => (
                      <div key={index} className="p-printer_list_item">
                        <div className="printer_status">{printer.status}</div>
                        <div className="printer_info">
                          <div className="printer_icon"><img src={ServerUrl.urlSub + `assets/icon/Choose_Printer.svg`} /></div>
                          <div className="printer_name"> {printer.printerName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Col>
      </Row >
    </div>
  );
}

export default memo(ListView);
