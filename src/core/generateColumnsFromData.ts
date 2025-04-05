import { CustomColumn } from "../types/CustomColumn";

export const convertToTitle = (key: string): string => {
  const map: Record<string, string> = {
    id: "ID",
    name: "Ad Soyad",
    email: "E-Posta",
    age: "Yaş",
    created_at: "Oluşturulma Tarihi",
    updated_at: "Güncellenme Tarihi",
    address: "Adres",
  };
  return map[key] || key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
export const detectType = (value: any): "string" | "number" | "date" | "boolean" => {
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "string") {
    // ISO tarih olup olmadığını kontrol et
    const date = Date.parse(value);
    if (!isNaN(date) && value.includes("T")) return "date";
    return "string";
  }
  return "string";
};

export const generateColumnsFromData = (data: any[]): CustomColumn[] => {
  if (!data || !data.length) return [];

  const sample = data[0];

  return Object.keys(sample).map((key) => {
    const value = sample[key];
    return {
      id: key,
      key,
      title: convertToTitle(key),
      dataIndex: key,
      type: detectType(value),
      visible: true,
      locked: ["id", "name", "email"].includes(key),
    };
  });
};
