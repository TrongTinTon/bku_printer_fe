import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ServerUrl from "../../../constants/ServerUrl";

const renderItemMenu = (moduleLists) => {
  const subItemsModule = {
    sub1: ["Task", "Project", "Congviec", "Tacvu", "Danhgiacuoinam", "Faq"],
    sub2: ["Campaigns", "Leads", "Accounts", "Contacts", "Quotes", "SalesOrder", "Invoice"],
    sub3: ["Products", "Services", "Assets", "Vendors", "PurchaseOrder", "BGNT", "In", "Ra"],
    sub4: ["Employee", "Loan"],
  };

  const renderSubItem = (subKey) => {
    const listSub = subItemsModule[subKey];

    const newList = listSub.map((module) => {
      const isShowPer = moduleLists.filter((item) => item.name === module);
      const listViewable = isShowPer.length > 0 ? isShowPer[0].permission.listViewable : false;
      const moduleName = isShowPer.length > 0 ? isShowPer[0].name : null;

      if (listViewable) {
        const imgIcon = `${ServerUrl.urlSub}assets/icon/${moduleName}.svg`;
        return {
          label: isShowPer[0].label,
          key: `/listview?module=${moduleName}`,
          icon: <img src={imgIcon} width="25px" height="25px" />,
        };
      }
    });
    const result = newList.filter((item) => item);
    return result;
  };

  return [
    {
      label: "Bảng điều khiển",
      key: "/",
      icon: (
        <div>
          <FontAwesomeIcon icon="fa-solid fa-gauge-high" />
        </div>
      ),
    },

    // Group CÁ NHÂN
    {
      label: "Cá nhân",
      key: "sub1",
      type: "group",
      children: [
        renderSubItem("sub1").length > 0 && {
          label: "Cá nhân",
          key: "sub1",
          icon: (
            <div>
              <FontAwesomeIcon icon="fa-solid fa-user-plus" />
            </div>
          ),
          children: renderSubItem("sub1"),
        },
      ],
    },

    // Group CÔNG VIỆC
    {
      label: "Công việc",
      key: "sub2",
      type: "group",
      children: [
        renderSubItem("sub2").length > 0 && {
          label: "Kinh doanh",
          key: "sub2",
          icon: (
            <div>
              <FontAwesomeIcon icon="fa-solid fa-chart-line" />
            </div>
          ),
          children: renderSubItem("sub2"),
        },

        renderSubItem("sub3").length > 0 && {
          label: "Kho hàng",
          key: "sub3",
          icon: (
            <div>
              <FontAwesomeIcon icon="fa-solid fa-warehouse" />
            </div>
          ),
          children: renderSubItem("sub3"),
        },

        renderSubItem("sub4").length > 0 && {
          label: "Nhân sự",
          key: "sub4",
          icon: (
            <div>
              <FontAwesomeIcon icon="fa-solid fa-users-gear" />
            </div>
          ),
          children: renderSubItem("sub4"),
        },
      ],
    },
  ];
};

export default { renderItemMenu };
