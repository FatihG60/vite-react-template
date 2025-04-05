import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { CustomColumn } from "../types/CustomColumn";
interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
  }
export const exportData = (
  dataToExport: DataType[],
  type: "xlsx" | "csv",
  allColumns: CustomColumn[]
) => {
  const selectedCols = allColumns.filter((col) => col.visible !== false);

  const filtered = dataToExport.map((row) => {
    const newRow: Record<string, any> = {};
    selectedCols.forEach((col) => {
      newRow[col.dataIndex] = row[col.dataIndex as keyof DataType];
    });
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(filtered);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Veriler");

  const fileName = `tablo_verileri_${new Date().toISOString().slice(0, 10)}.${type}`;
  const buffer = XLSX.write(workbook, {
    bookType: type,
    type: "array",
  });

  const mimeType =
    type === "csv"
      ? "text/csv;charset=utf-8;"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([buffer], { type: mimeType });
  saveAs(blob, fileName);
};

