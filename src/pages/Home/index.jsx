import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerUrl from "src/constants/ServerUrl";
import AdminHomePage from "./Admin";
import { Col, Row, Button, Upload, message, Select, Modal, notification } from 'antd';

import { getPageCounter, getPrinters, addPrintHistory, getPrintHistorys } from "src/store/module/actions";

import { InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;
import "./style.scss";

function HomePage({ socket }) {
  const dispatch = useDispatch();
  const accountStore = useSelector((state) => state.account);
  const [pageCount, setPageCount] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [printerlist, setPrinterlist] = useState([]);
  const [historylist, setHistorylist] = useState([]);
  const [choosePrinter, setChoosePrinter] = useState(null);
  const [chooseFileName, setChooseFileName] = useState(null);
  const [modalHeaderText, setModalHeaderText] = useState(null);

  const { roleId, userId } = accountStore;

  if (roleId == "2") {
    return <AdminHomePage />;
  }

  const handleFileUpload = async (file) => {
    const fileType = file.type;
    if (fileType === "application/pdf") {
      handleUpload(file)
    } else {
      message.error("Vui lòng chỉ chọn tệp PDF.");
    }

    return false; // Ngăn việc tải tệp lên server
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      // Gọi API để đếm số trang
      const response = await dispatch(getPageCounter(formData));
      if (response.data) {
        setPageCount(response.data.pageCount);
        message.success(`File uploaded successfully! Page count: ${response.data.pageCount}`);
      } else {
        message.error(response.message || 'Failed to process the file.');
      }
      setChooseFileName(file.name)
    } catch (error) {
      message.error('Error occurred while uploading the file.');
    } finally {

    }

  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const showPrinters = async () => {
    setModalHeaderText("Chọn máy in")
    setOpen(true);
    const response = await dispatch(getPrinters({ status: "Hoạt động" }));
    if (response.data) {
      // const result = response.data.filter((printer) =>
      //   printer && printer.tray.some((item) => item.tray_name === "A1" && item.total_page > 0)
      // );
      setLoading(false)
      setPrinterlist(response.data)
    }
  }
  const handleGetPrintHistorys = async () => {
    const response = await dispatch(getPrintHistorys());
    if (response.data) {
      setHistorylist(response.data)
    }
  }

  const handleChoosePrinter = (printer) => {
    setChoosePrinter(printer)
  }

  const handlePrint = async () => {
    resetModal()
    const payload = { userId: userId, printerId: choosePrinter.id, fileName: chooseFileName, pages: pageCount }
    const response = await dispatch(addPrintHistory(payload));
    openNotification(response.status, "Thông báo", response.status == "success" ? "Đã in tài liệu, vui lòng đến máy in để lấy tài liệu!" : response.message)
    handleGetPrintHistorys()
  };

  const openNotification = (status, title, description) => {
    status == "success" && notification.success({
      message: title,
      description: description,
      showProgress: true,
    });
    status == "error" && notification.error({
      message: title,
      description: description,
      showProgress: true,
    });
  };

  const handleCancel = () => {
    resetModal()
  };

  const resetModal = () => {
    setOpen(false);
    setPrinterlist([]);
    setChoosePrinter(null);
    setModalHeaderText(null);
  };

  const [api, contextHolder] = notification.useNotification();

  return (
    <div>
      <Row className="container" gutter={[16, 16]} align="">
        <Col
          className="leftsidebar"

          xs={{
            order: 2,
            span: 24
          }}

          sm={{
            order: 2,
            span: 24
          }}

          lg={{
            order: 1,
            span: 6
          }}
        >
          <div className="history">
            <div className="history_title">Lịch sử in ấn</div>
            <div className="history_body">
              {
                historylist.map((history, index) => (
                  <div className="item">
                    <div className="item_header">
                      <div className="item_header_clock">
                        <div className="top_text">22/10/2024</div>
                        <div className="bottom_text">4:25</div>
                      </div>
                      <div className="item_header_icon">
                        <img src={ServerUrl.urlSub + `assets/icon/history.svg`} />
                      </div>
                    </div>
                    <div className="item_body">
                      <div className="item_textinfo">
                        <p>Tên file</p>
                        <p>{history.fileName}</p>
                      </div>
                      <div className="item_textinfo">
                        <p>Số trang</p>
                        <p>{history.pages}</p>
                      </div>
                      <div className="item_textinfo">
                        <p>Số máy</p>
                        <p>{history.printerName}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </Col>
        <Col
          className="content"
          xs={{
            order: 1,
            span: 24
          }}

          sm={{
            order: 1,
            span: 24
          }}

          lg={{
            order: 2,
            span: 18
          }}

        >
          <div className="printer_flow">
            <div className="printer_flow_title">In tài liệu</div>
            <div className="printer_flow_body">
              <div className="printer_flow_body_inner">
                <div className="printer_flow_body_inner_header">
                  <div className="page_litmit">Hạn mức in còn lại: 999</div>
                  <Button
                    icon={<img src={ServerUrl.urlSub + `assets/icon/add_page.svg`} />}
                    className="add-page-btn"
                  >
                    Mua trang
                  </Button>
                </div>
                <div className="printer_flow_body_inner_main">
                  <div className="upload">
                    <h2>Upload File PDF hoặc Word</h2>
                    <Dragger
                      accept=".pdf,.docx"
                      beforeUpload={handleFileUpload}
                      maxCount={1}
                      showUploadList={true}
                      listType="picture"
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Nhấn hoặc kéo tệp vào đây để tải lên
                      </p>
                      <p className="ant-upload-hint">
                        Hỗ trợ tệp PDF hoặc Word (DOCX). Hãy chọn đúng loại tệp.
                      </p>
                    </Dragger>
                    {pageCount &&
                      <div className="upload_respone">
                        <div className="upload_respone_item">
                          <p className="upload_respone_item_label">Tổng số trang:</p>
                          <p className="upload_respone_item_text">{pageCount}</p>
                        </div>

                        <div className="upload_respone_item">
                          <p className="upload_respone_item_label">Số trang hiện có:</p>
                          <p className="upload_respone_item_text">{pageCount}</p>
                          <div className="choose">
                            <Select
                              defaultValue="A4"
                              style={{
                                width: 120,
                              }}
                              onChange={handleChange}
                              options={[
                                {
                                  value: 'A1',
                                  label: 'A1',
                                },
                                {
                                  value: 'A2',
                                  label: 'A2',
                                },
                                {
                                  value: 'A3',
                                  label: 'A3',
                                },
                                {
                                  value: 'A4',
                                  label: 'A4',
                                  disabled: true,
                                },
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                    }
                  </div>
                  {pageCount && pageCount > 0 && <Button
                    onClick={showPrinters}
                    icon={<img src={ServerUrl.urlSub + `assets/icon/Choose_Printer.svg`} />}
                    className="choose-printer-btn"
                  >
                    Chọn máy in
                  </Button>}
                </div>
              </div>
            </div>
          </div>

        </Col>
      </Row >
      <Modal
        className="modal"
        title={modalHeaderText}
        footer={
          <Button disabled={choosePrinter !== null ? false : true} className="modal-footer-btn" onClick={handlePrint}>
            Chấp nhận
          </Button>
        }
        loading={loading}
        open={open}
        onCancel={handleCancel}
      >
        <div className="printer_list">
          {printerlist
            .filter(
              (printer) =>
                printer &&
                printer.tray.some(
                  (item) => item.tray_name === "A1" && item.total_page > 0
                )
            )
            .map((printer, index) => (
              <div key={index}>

                <Button
                  onClick={() => handleChoosePrinter(printer)}
                  icon={<img src={ServerUrl.urlSub + `assets/icon/Choose_Printer.svg`} />}
                  className="printer_list_item"
                >
                  {printer.printerName}
                </Button>
              </div>
            ))}
        </div>
        {
          choosePrinter && <div className="chose">
            <div className="chose_label">Đá chọn máy:</div>
            <div className="chose_text">{choosePrinter.printerName}</div>
          </div>
        }

      </Modal>
    </div>
  );
}

export default HomePage;
