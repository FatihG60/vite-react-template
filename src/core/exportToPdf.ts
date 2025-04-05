import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CustomColumn } from "../types/CustomColumn";
interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
  }
export const exportToPDF = (dataToExport: DataType[], allColumns: CustomColumn[]) => {
    const selectedCols = allColumns.filter((col) => col.visible !== false);
  
    const doc = new jsPDF();
    const tableColumn = selectedCols.map((col) => col.title);
    const tableRows = dataToExport.map((row) =>
      selectedCols.map((col) => row[col.dataIndex as keyof DataType])
    );
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });
  
    const filename = `tablo_verileri_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };
  