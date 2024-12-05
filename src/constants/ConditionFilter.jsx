export const ConditionFilter = (type) => {
  switch (type) {
    case "currency":
    case "double":
      return {
        operator: [
          { value: "=", label: "Bằng" },
          { value: "!=", label: "Không bằng" },
          { value: "'<'", label: "Nhỏ hơn" },
          { value: ">", label: "Lớn hơn" },
          { value: "<=", label: "Nhỏ hơn hoặc bằng" },
          { value: ">=", label: "Lớn hơn hoặc bằng" },
          { value: "empty", label: "Trống" },
          { value: "not empty", label: "Không trống" },
        ],
        operatorDefault: "=",
      };
    default:
      return {
        operator: [
          { value: "=", label: "Bằng" },
          { value: "!=", label: "Không bằng" },
          { value: "like start", label: "Bắt đầu với" },
          { value: "like end", label: "Kết thúc bằng" },
          { value: "like", label: "Chứa" },
          { value: "not like", label: "Không chứa" },
          { value: "empty", label: "Trống" },
          { value: "not empty", label: "Không trống" },
        ],
        operatorDefault: "like",
      };
  }
};
