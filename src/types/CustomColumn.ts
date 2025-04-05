export type CustomColumn = {
    id: string;
    key: string;
    title: string;
    dataIndex: string;
    type: "string" | "number" | "date" | "boolean";
    visible?: boolean;
    locked?: boolean;
    fixed?: "left" | "right";
  };